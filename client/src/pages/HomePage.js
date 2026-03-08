import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Özel Ders Platformu'na Hoşgeldiniz</h1>
          <p>Kaliteli eğitim için öğrencileri ve öğretmenleri bir araya getiriyoruz</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Öğretmen Olarak Başla</Link>
            <Link to="/teachers" className="btn btn-secondary">Öğretmen Bul</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Neden Bizi Seçmelisiniz?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>👨‍🏫 Kaliteli Öğretmenler</h3>
            <p>En iyi öğretmenlerle tanış</p>
          </div>
          <div className="feature">
            <h3>📅 Esnek Takvim</h3>
            <p>Senin saatine uygun dersler</p>
          </div>
          <div className="feature">
            <h3>💬 Doğrudan İletişim</h3>
            <p>Öğretmenleriyle doğrudan mesajlaş</p>
          </div>
          <div className="feature">
            <h3>⭐ Değerlendirme Sistemi</h3>
            <p>Gerçek kullanıcı yorumlarını oku</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
