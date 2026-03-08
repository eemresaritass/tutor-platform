import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import { usersService } from '../services/api';
import '../styles/TeachersPage.css';

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await usersService.getTeachers();
        setTeachers(response.data);
      } catch (err) {
        setError('Öğretmenler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="teachers-page">
      <h1>Öğretmenler</h1>
      <div className="teachers-grid">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onClick={() => navigate(`/teacher/${teacher.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default TeachersPage;
