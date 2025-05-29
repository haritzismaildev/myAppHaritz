markdown
# MyAppHaritz

**MyAppHaritz** adalah aplikasi full stack yang dibangun menggunakan prinsip Clean Architecture. Proyek ini mengintegrasikan:
- **Backend ASP.NET Core** (dengan pembagian ke dalam *Core*, *Application*, *Infrastructure*, dan *Api*)
- **Frontend React** dengan Vite
- **Database SQL Server**
- **Pengiriman Email untuk MFA/OTP** (menggunakan Gmail SMTP)
- **Docker** untuk containerization

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker Setup](#docker-setup)
- [Email (OTP/MFA) Configuration](#email-otpmfa-configuration)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

MyAppHaritz didesain untuk menjadi solusi yang robust, maintainable, dan scalable dengan menerapkan prinsip Clean Architecture. 
Proyek ini terdiri dari:
- **Backend** dengan pemisahan logika domain, use case, dan implementasi infrastruktur.
- **Frontend** modern dengan React, disertai validasi login & OTP/MFA.
- **Database SQL Server** untuk penyimpanan data.
- **SMTP Email Integration** untuk pengiriman kode OTP (menggunakan akun Gmail).
- **Docker** untuk memudahkan setup dan deployment aplikasi.

## Project Structure


myAppHaritz/ ├── MyAppHaritz.Api/ # API endpoint ASP.NET Core ├── MyAppHaritz.Core/ # Domain entities, interfaces, dan core logic ├── MyAppHaritz.Application/ # Use case dan application services ├── MyAppHaritz.Infrastructure/ # Implementasi konkret (database, email, dsb.) ├── myAppHaritz-frontend/ # Frontend React (Vite) └── docker/ # Konfigurasi Docker dan docker-compose.yml

## Database Setup

1. **SQL Server:**  
   Pastikan Anda memiliki instance SQL Server (lokal atau remote).  
2. **Connection String:**  
   Di file `MyAppHaritz.Api/appsettings.json`, perbarui connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=MyAppDB;User Id=USERNAME;Password=PASSWORD;"
   }

Migrasi Database: Gunakan Entity Framework Core untuk melakukan migrasi:

dotnet ef database update --project MyAppHaritz.Infrastructure

Backend Setup

    Prasyarat: Pastikan Anda telah memasang .NET SDK (6/7/8) dan Visual Studio/VS Code.

    Restore Dependencies: Dari root solusi, jalankan:
    dotnet restore

Jalankan API: Jalankan proyek API:
dotnet run --project MyAppHaritz.Api

API akan berjalan di, misalnya, https://localhost:7164.

Frontend Setup

Instalasi Dependency: Di folder myAppHaritz-frontend/, jalankan:
npm install

Jalankan Frontend: Jalankan Vite:
npm run dev

Akses frontend di http://localhost:5173.

Pengaturan Proxy (Opsional): Jika frontend dan backend berjalan pada port berbeda, gunakan proxy pada vite.config.ts:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7164',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

Docker Setup

    Prasyarat: Pastikan Docker sudah terpasang.

    Docker Compose: Dalam folder docker/ (atau di root), terdapat file docker-compose.yml untuk membangun container backend, frontend, dan (opsional) database.

    Build & Run: Dari folder root, jalankan:
    docker-compose up --build

Email (OTP/MFA) Configuration

Konfigurasi Gmail:

    Aktifkan Two-Step Verification: Masuk ke google account, buka bagian Security, aktifkan Two-Step Verification.
    Buat App Password: Setelah verifikasi dua langkah aktif, buat App Password di google app password. Gunakan password ini sebagai password SMTP.

Update SMTP Settings: Di file MyAppHaritz.Api/appsettings.json, masukkan konfigurasi SMTP:
"Smtp": {
  "Host": "smtp.gmail.com",
  "Port": 587,
  "Username": "haritz.ismail.dev@gmail.com",
  "Password": "YOUR_APP_PASSWORD"
}

    Pengiriman OTP: Ketika pengguna login, sistem akan menghasilkan OTP dan mengirimkannya melalui email. Pastikan untuk memeriksa folder Spam jika tidak langsung muncul.

API Documentation

Swagger digunakan untuk dokumentasi API. Setelah menjalankan API, buka:
https://localhost:7164/swagger/index.html

Di sana terdapat tampilan dokumentasi dengan ikon gembok ("Authorize") apabila Anda telah mengonfigurasi skema keamanan untuk JWT atau API-Auth.
Troubleshooting

    Network Error saat Login: Pastikan URL endpoint API di frontend sudah benar dan backend berjalan. Cek juga konfigurasi CORS di API dan proxy pada Vite.

    Email OTP Tidak Terkirim: Periksa konfigurasi SMTP, app password dari Google, dan pastikan tidak ada firewall yang menghalangi koneksi keluar.

    Permission Issues: Pastikan file seperti folder .vs telah dikecualikan di .gitignore.

    Build Errors: Pastikan semua paket NuGet (misalnya, Microsoft.Extensions.Configuration.Binder) dan npm packages telah terinstal.

Contributing

Kontribusi sangat kami sambut! Silakan fork repositori ini dan buat pull request dengan perbaikan atau fitur baru. Untuk perubahan besar, mohon diskusikan terlebih dahulu melalui issue.
