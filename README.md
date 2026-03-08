# Özel Ders Platformu

Öğrencileri ve öğretmenleri buluşturan modern bir web platformu.

## Özellikler

✅ Kullanıcı kayıt ve kimlik doğrulama
✅ Öğretmen profilleri ve ara
✅ Ders rezervasyonu ve takvim
✅ Gerçek zamanlı mesajlaşma
✅ Değerlendirme ve yorum sistemi

## Teknoloji Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, Socket.io
- **Database**: PostgreSQL
- **Authentication**: JWT

## Kurulum

### Ön Koşullar
- Node.js (v14+)
- PostgreSQL
- npm veya yarn

### Backend Kurulumu

```bash
cd server
npm install
cp .env.example .env
# .env dosyasını kendi ayarlarınızla düzenleyin
npm run dev
```

### Frontend Kurulumu

```bash
cd client
npm install
npm start
```

## Veritabanı Kurulumu

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE tutor_platform;

# Schema'yı yükleyin
\c tutor_platform
\i database/schema.sql
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Users
- `GET /api/users/teachers` - Öğretmenleri listele
- `GET /api/users/:id` - Kullanıcı profilini getir
- `PUT /api/users/:id` - Profili güncelle

### Lessons
- `GET /api/lessons` - Tüm dersleri listele
- `GET /api/lessons/teacher/:id` - Öğretmenin derslerini getir
- `POST /api/lessons` - Yeni ders oluştur

### Bookings
- `GET /api/bookings` - Rezervasyonları listele
- `POST /api/bookings` - Yeni rezervasyon oluştur

### Messages
- `GET /api/messages/:id` - Mesajları getir
- `POST /api/messages` - Mesaj gönder

### Reviews
- `GET /api/reviews/teacher/:id` - Öğretmen yorumlarını getir
- `POST /api/reviews` - Yorum oluştur

## Dosya Yapısı

```
ödev/
├── server/              # Backend sunucusu
│   ├── routes/         # API rotaları
│   ├── middleware/     # Middleware'lar
│   ├── config/         # Yapılandırma dosyaları
│   ├── server.js       # Ana sunucu dosyası
│   └── package.json
├── client/              # Frontend uygulaması
│   ├── src/
│   │   ├── components/ # React bileşenleri
│   │   ├── pages/      # Sayfalar
│   │   ├── services/   # API servisleri
│   │   ├── styles/     # CSS dosyaları
│   │   └── App.js      # Ana uygulama
│   └── package.json
├── database/            # Veritabanı şemaları
│   └── schema.sql
└── README.md
```

## Katkıda Bulunma

Projemize katkıda bulunmak istiyorsanız, lütfen fork yapın ve pull request gönderin.

## Lisans

MIT License
