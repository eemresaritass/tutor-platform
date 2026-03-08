import React from 'react';
import '../styles/TeacherCard.css';

function TeacherCard({ teacher, onClick }) {
  return (
    <div className="teacher-card" onClick={onClick}>
      <div className="teacher-avatar">👨‍🏫</div>
      <h3>{teacher.name}</h3>
      <p className="teacher-title">{teacher.title}</p>
      <p className="teacher-bio">{teacher.bio}</p>
      <div className="teacher-rate">
        <strong>₺ {teacher.hourly_rate} / saat</strong>
      </div>
      <button className="teacher-button">Detayları Gör</button>
    </div>
  );
}

export default TeacherCard;
