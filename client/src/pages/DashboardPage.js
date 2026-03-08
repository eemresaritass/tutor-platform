import React, { useState } from 'react';
import '../styles/DashboardPage.css';

function DashboardPage({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-page">
      <h1>Panel - {user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}</h1>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Özet
        </button>
        <button
          className={activeTab === 'bookings' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('bookings')}
        >
          Ders Rezervasyonları
        </button>
        {user.role === 'teacher' && (
          <button
            className={activeTab === 'lessons' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('lessons')}
          >
            Derslerim
          </button>
        )}
        <button
          className={activeTab === 'profile' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div>
            <h2>Başlangıç Sayfası</h2>
            <p>Hoşgeldin {user.name}!</p>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div>
            <h2>Ders Rezervasyonları</h2>
            <p>Rezevasyonlarınız burda görünecek</p>
          </div>
        )}
        {activeTab === 'lessons' && user.role === 'teacher' && (
          <div>
            <h2>Derslerim</h2>
            <p>Dersleriniz burda görünecek</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <h2>Profil Bilgileri</h2>
            <p>Adı: {user.name}</p>
            <p>E-mail: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
