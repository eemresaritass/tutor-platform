const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:bdsBzzlpqIUKPzQFbYFbNEcvhaDiPXvk@postgres.railway.internal:5432/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlandı');
});

pool.on('error', (err) => {
  console.error('❌ Veritabanı bağlantı hatası:', err);
});

async function initializeDatabase() {
  try {
    // Users Tablosu
    await pool.query(`
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

    // Lessons Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        subject VARCHAR(255) NOT NULL,
        level VARCHAR(100),
        description TEXT,
        hourly_rate DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id),
        lesson_id INTEGER NOT NULL REFERENCES lessons(id),
        scheduled_date TIMESTAMP NOT NULL,
        duration INTEGER DEFAULT 60,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reviews Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id),
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📊 Tüm tablolar oluşturuldu!');
    await seedDatabase();
  } catch (error) {
    console.error('❌ Tablo oluşturma hatası:', error);
  }
}

async function seedDatabase() {
  try {
    const hashedPassword = bcrypt.hashSync('password123', 10);

    // Örnek öğretmenler
    await pool.query(`
      INSERT INTO users (name, email, password, role, bio, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Ahmet Yılmaz', 'ahmet@example.com', hashedPassword, 'teacher', '15 yıl deneyimli matematik öğretmeni', 150]);

    await pool.query(`
      INSERT INTO users (name, email, password, role, bio, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Fatma Kara', 'fatma@example.com', hashedPassword, 'teacher', 'Native speaker İngilizce öğretmeni', 120]);

    await pool.query(`
      INSERT INTO users (name, email, password, role, bio, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Mehmet Demir', 'mehmet@example.com', hashedPassword, 'teacher', 'Fizik ve kimya öğretmeni', 130]);

    await pool.query(`
      INSERT INTO users (name, email, password, role, bio, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Ayşe Yıldız', 'ayse@example.com', hashedPassword, 'teacher', 'Almanca öğretmeni', 110]);

    // Örnek öğrenci
    await pool.query(`
      INSERT INTO users (name, email, password, role, bio)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['Demo Öğrenci', 'demo@example.com', hashedPassword, 'student', 'Demo öğrenci profili']);

    console.log('✅ Örnek veriler eklendi');
  } catch (error) {
    console.error('❌ Seed data ekleme hatası:', error);
  }
}

// Veritabanı bağlantısını başlat
initializeDatabase();

module.exports = pool;
