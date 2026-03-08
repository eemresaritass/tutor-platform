const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../tutor_platform.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı açılırken hata:', err);
  } else {
    console.log('✅ SQLite veritabanına bağlandı:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
        bio TEXT,
        hourly_rate REAL,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lessons Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        level TEXT,
        description TEXT,
        hourly_rate REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(teacher_id) REFERENCES users(id)
      )
    `);

    // Bookings Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        scheduled_date DATETIME NOT NULL,
        duration INTEGER DEFAULT 60,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      )
    `);

    // Messages Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
      )
    `);

    // Reviews Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        teacher_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(teacher_id) REFERENCES users(id)
      )
    `, (err) => {
      if (!err) {
        console.log('📊 Tüm tablolar oluşturuldu!');
        seedDatabase();
      }
    });
  });
}

function seedDatabase() {
  // Örnek veriler
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('password123', 10);

  db.run(`INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [1, 'Ahmet Yılmaz', 'ahmet@example.com', hashedPassword, 'teacher', '15 yıl deneyimli matematik öğretmeni', 150, null]);

  db.run(`INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [2, 'Fatma Kara', 'fatma@example.com', hashedPassword, 'teacher', 'Native speaker İngilizce öğretmeni', 120, null]);

  db.run(`INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [3, 'Demo Öğrenci', 'demo@example.com', hashedPassword, 'student', 'Demo öğrenci profili', null, null]);

  console.log('✅ Örnek veriler eklendi');
}

module.exports = db;
