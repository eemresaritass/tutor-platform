# Özel Ders Platformu - Copilot İçin Rehber

Bu proje, öğrencileri öğretmenlerle buluşturan bir web platformudur.

## Proje Yapısı

- `/server` - Node.js/Express backend (API sunucusu)
- `/client` - React frontend (kullanıcı arayüzü)
- `/database` - PostgreSQL veritabanı şemaları

## Teknoloji Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Database**: PostgreSQL

## Temel Özellikler

1. Kullanıcı kaydı ve profil yönetimi
2. Ders tarifesi ve arama
3. Ders rezervasyonu ve takvim
4. Mesajlaşma sistemi
5. Değerlendirme ve yorum

## Başlama Adımları

1. Backend kurulumu: `cd server && npm install`
2. Frontend kurulumu: `cd client && npm install`
3. PostgreSQL veritabanını ayarla
4. `.env` dosyası ayarlamalarını tamamla
5. `npm start` ile her klasörü çalıştır

## Veritabanı Bağlantı Dizesi

`postgresql://user:password@localhost:5432/tutor_platform`
