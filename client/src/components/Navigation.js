import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 Özel Ders Platformu
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Ana Sayfa</Link>
          <Link to="/teachers" className="nav-link">Öğretmenler</Link>
          {user && user.role === 'teacher' && (
            <Link to="/dashboard" className="nav-link">Panel</Link>
          )}
          {user && (
            <Link to="/messages" className="nav-link">Mesajlar</Link>
          )}
          {user ? (
            <>
              <span className="nav-user">Hoşgeldin, {user.name}</span>
              <button onClick={onLogout} className="nav-button logout">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">Giriş Yap</Link>
              <Link to="/register" className="nav-button register">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
