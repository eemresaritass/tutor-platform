import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Mock veriler
const mockTeachers = [
  {
    id: 1,
    name: 'Ahmet Yilmaz',
    title: 'Matematik Öğretmeni',
    email: 'ahmet@example.com',
    role: 'teacher',
    bio: '15 yıl deneyimli matematik öğretmeni. Lise ve üniversite sınav hazırlığından uzman.',
    hourly_rate: 150,
  },
  {
    id: 2,
    name: 'Fatma Kara',
    title: 'İngilizce Öğretmeni',
    email: 'fatma@example.com',
    role: 'teacher',
    bio: 'Native speaker İngilizce öğretmeni. IELTS ve TOEFL hazırlığında başarılı.',
    hourly_rate: 120,
  },
  {
    id: 3,
    name: 'Murat Çetin',
    title: 'Fizik Öğretmeni',
    email: 'murat@example.com',
    role: 'teacher',
    bio: 'Bilim Olimpiyatları ve YKS hazırlığında öğrenci yetiştiren deneyimli öğretmen.',
    hourly_rate: 140,
  },
  {
    id: 4,
    name: 'Zeynep Güneş',
    title: 'Kimya Öğretmeni',
    email: 'zeynep@example.com',
    role: 'teacher',
    bio: 'Kimya alanında lise ve ön lisans seviyesinde dersler veren öğretmen.',
    hourly_rate: 130,
  },
];

const mockReviews = {
  1: [
    { id: 1, student_name: 'Ali Demir', rating: 5, comment: 'Muazzam bir öğretmen, çok öğredim.' },
    { id: 2, student_name: 'Ayşe Yıldız', rating: 4, comment: 'Anlatımı çok iyi, kesinlikle tavsiye ederim.' },
  ],
  2: [
    { id: 3, student_name: 'Hüseyin Koç', rating: 5, comment: 'İngilizce konuşma konusunda harika yardımı oldu.' },
  ],
  3: [
    { id: 4, student_name: 'Nermin Polat', rating: 5, comment: 'Fizik artık sevgilim oldu!' },
    { id: 5, student_name: 'Emre Şahin', rating: 4, comment: 'Çok iyi öğretiliyor, pratik soruları faydalı.' },
  ],
  4: [],
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => {
    // Mock login
    return Promise.resolve({
      data: {
        token: 'mock_token_' + Date.now(),
        user: { id: 1, name: 'Demo User', email, role: 'student' }
      }
    });
  },
  register: (name, email, password, role) =>
    Promise.resolve({
      data: {
        token: 'mock_token_' + Date.now(),
        user: { id: Math.random(), name, email, role }
      }
    }),
};

export const usersService = {
  getTeachers: () => Promise.resolve({ data: mockTeachers }),
  getUser: (id) => Promise.resolve({ data: mockTeachers.find(t => t.id === parseInt(id)) || mockTeachers[0] }),
  updateProfile: (id, data) => Promise.resolve({ data: { ...mockTeachers[0], ...data } }),
};

export const lessonsService = {
  getAllLessons: () => Promise.resolve({ data: [] }),
  getLessonsByTeacher: (teacherId) => Promise.resolve({ data: [] }),
  createLesson: (data) => Promise.resolve({ data }),
};

export const bookingsService = {
  getBookings: () => Promise.resolve({ data: [] }),
  createBooking: (data) => Promise.resolve({ data: { ...data, id: Math.random() } }),
};

export const messagesService = {
  getMessages: (conversationId) => Promise.resolve({ data: [] }),
  sendMessage: (receiverId, content) => Promise.resolve({ data: { receiver_id: receiverId, content } }),
};

export const reviewsService = {
  getReviews: (teacherId) => Promise.resolve({ data: mockReviews[teacherId] || [] }),
  createReview: (data) => Promise.resolve({ data }),
};

export default apiClient;
