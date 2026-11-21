# UMKM-APP — Dashboard Admin Bunda Riris

Dashboard admin website Menu Sedap ala Bunda Riris (React + Vite + Tailwind). Datanya diambil dari **UMKM-API** (backend Laravel); website publiknya ada di **UMKM-LandingPages**.

Tidak ada halaman registrasi. Akun admin dibuat sekali lewat seeder di UMKM-API (`ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env` backend).

---

## Cara Menjalankan Project

### 1. Aktifkan Backend (UMKM-API)

Masuk ke folder `UMKM-API`, lalu jalankan server Laravel:

```bash
cd UMKM-API
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`.

---

### 2. Jalankan Frontend (UMKM-APP)

Buka terminal baru, masuk ke folder `UMKM-APP`, lalu jalankan:

```bash
cd UMKM-APP
npm install
cp .env.example .env
npm run dev
```

Sebelum push, jalankan `npm run lint` dan `npm run build`.

Frontend akan berjalan di `http://localhost:5173`.

Buka browser dan akses: **http://localhost:5173**
