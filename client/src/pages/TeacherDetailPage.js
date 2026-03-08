import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersService, reviewsService, bookingsService } from '../services/api';
import '../styles/TeacherDetailPage.css';

function TeacherDetailPage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = await usersService.getUser(id);
        setTeacher(teacherResponse.data);

        const reviewsResponse = await reviewsService.getReviews(id);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Veri yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookLesson = async () => {
    if (!scheduledDate) {
      alert('Lütfen bir tarih seçiniz');
      return;
    }
    try {
      await bookingsService.createBooking({
        lesson_id: 1, // Bu gerçek lesson_id olmalıdır
        scheduled_date: scheduledDate,
      });
      alert('Ders başarıyla rezerve edildi!');
    } catch (err) {
      alert('Rezervasyon başarısız');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!teacher) return <div>Öğretmen bulunamadı</div>;

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="teacher-detail-page">
      <div className="teacher-header">
        <h1>{teacher.name}</h1>
        <p className="bio">{teacher.bio}</p>
        <div className="rating">
          <span>⭐ {averageRating}</span>
          <span>({reviews.length} yorum)</span>
        </div>
      </div>

      <div className="teacher-booking">
        <h2>Ders Rezervasyonu</h2>
        <div className="booking-form">
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <button onClick={handleBookLesson}>Dersi Rezerve Et</button>
        </div>
        <p className="price">Ders Ücreti: ₺ {teacher.hourly_rate}</p>
      </div>

      <div className="reviews-section">
        <h2>Yorumlar</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p>
                <strong>{review.student_name}</strong> - {'⭐'.repeat(review.rating)}
              </p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>Henüz yorum yok</p>
        )}
      </div>
    </div>
  );
}

export default TeacherDetailPage;
