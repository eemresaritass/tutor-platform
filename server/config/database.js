const { Pool } = require('pg');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Environment'a göre veritabanı seçimi
let db;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // Production için PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.on('connect', () => {
    console.log('✅ PostgreSQL veritabanına bağlandı (Production)');
  });

  pool.on('error', (err) => {
    console.error('❌ PostgreSQL bağlantı hatası:', err);
  });

  db = {
    query: async (sql, params = []) => {
      const result = await pool.query(sql, params);
      return { rows: result.rows };
    },
    close: () => pool.end()
  };
} else {
  // Development için SQLite
  const dbPath = path.join(__dirname, '../../database/tutor_platform.db');
  const sqliteDb = new Database(dbPath);

  // Foreign keys'i etkinleştir
  sqliteDb.pragma('foreign_keys = ON');

  console.log('✅ SQLite veritabanına bağlandı (Development)');

  db = {
    query: (sql, params = []) => {
      try {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = sqliteDb.prepare(sql);
          const rows = stmt.all(params);
          return { rows };
        } else {
          const stmt = sqliteDb.prepare(sql);
          const result = stmt.run(params);
          return { rows: [{ id: result.lastInsertRowid }] };
        }
      } catch (error) {
        throw error;
      }
    },
    close: () => sqliteDb.close()
  };
}

// Veritabanı tablolarını oluştur
async function initializeDatabase() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // PostgreSQL tabloları
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher')),
          bio TEXT,
          hourly_rate DECIMAL(10,2),
          avatar_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS lessons (
          id SERIAL PRIMARY KEY,
          teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          subject VARCHAR(255) NOT NULL,
          level VARCHAR(100),
          description TEXT,
          hourly_rate DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
          scheduled_date TIMESTAMP NOT NULL,
          duration INTEGER DEFAULT 60,
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('📊 PostgreSQL tabloları oluşturuldu!');
    } else {
      // SQLite tabloları zaten oluşturulmuş
      console.log('📊 SQLite tabloları zaten mevcut!');
    }

    await seedDatabase();
  } catch (error) {
    console.error('❌ Tablo oluşturma hatası:', error);
  }
}

// Örnek veriler ekle
async function seedDatabase() {
  try {
    const hashedPassword = bcrypt.hashSync('password123', 10);

    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // PostgreSQL için seed data
      await db.query(`
        INSERT INTO users (name, email, password, role, bio, hourly_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, ['Ahmet Yılmaz', 'ahmet@example.com', hashedPassword, 'teacher', '15 yıl deneyimli matematik öğretmeni', 150]);

      await db.query(`
        INSERT INTO users (name, email, password, role, bio, hourly_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, ['Fatma Kara', 'fatma@example.com', hashedPassword, 'teacher', 'Native speaker İngilizce öğretmeni', 120]);

      await db.query(`
        INSERT INTO users (name, email, password, role, bio, hourly_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, ['Mehmet Demir', 'mehmet@example.com', hashedPassword, 'teacher', 'Fizik ve kimya öğretmeni', 130]);

      await db.query(`
        INSERT INTO users (name, email, password, role, bio, hourly_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, ['Ayşe Yıldız', 'ayse@example.com', hashedPassword, 'teacher', 'Almanca öğretmeni', 110]);

      await db.query(`
        INSERT INTO users (name, email, password, role, bio)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, ['Demo Öğrenci', 'demo@example.com', hashedPassword, 'student', 'Demo öğrenci profili']);
    } else {
      // SQLite için seed data zaten eklenmiş
      console.log('✅ SQLite seed verileri zaten mevcut!');
    }

    console.log('✅ Örnek veriler eklendi');
  } catch (error) {
    console.error('❌ Seed data ekleme hatası:', error);
  }
}

// Prepared statements için yardımcı fonksiyonlar
const statements = {};

function prepareStatement(key, sql) {
  if (!statements[key]) {
    statements[key] = db.prepare(sql);
  }
  return statements[key];
}

// Veritabanı işlemlerini taklit etmek için basit wrapper
const databaseWrapper = {
  query: (sql, params = []) => {
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = prepareStatement(sql, sql);
        const rows = stmt.all(params);
        return { rows };
      } else {
        const stmt = prepareStatement(sql, sql);
        const result = stmt.run(params);
        return { rows: [{ id: result.lastInsertRowid }] };
      }
    } catch (error) {
      throw error;
    }
  },
  close: () => db.close()
};

// Veritabanı bağlantısını başlat
(async () => {
  await initializeDatabase();
})();

module.exports = databaseWrapper;
