# UMKM-APP: Dashboard Admin Bunda Riris

Dashboard admin website **Menu Sedap ala Bunda Riris** (React + Vite + Tailwind). Datanya diambil dari **UMKM-API** (backend Laravel); website publiknya ada di **UMKM-LandingPages**.

Tidak ada halaman registrasi. Akun admin dibuat sekali lewat seeder di UMKM-API (`ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env` backend). Token login berlaku 7 hari; setelah itu admin otomatis diarahkan ke halaman login.

## Fitur

| Halaman | Isi |
| --- | --- |
| Dashboard | Ringkasan jumlah produk, kategori, status profil, dan laporan keuangan, total saldo, serta riwayat login admin |
| Produk | Tambah, edit, dan hapus produk beserta foto; atur apakah produk tampil di katalog |
| Kategori | Kelola kategori produk |
| Profil | Nama usaha, deskripsi, alamat, nomor WhatsApp, email, media sosial, dan foto. Data ini tampil di website publik dan dipakai chatbot |
| Laporan Keuangan | Catat pemasukan dan pengeluaran, lengkap dengan total, saldo, dan grafik per tanggal |

Foto yang diunggah otomatis diperkecil oleh API (maks. 5 MB per foto), jadi foto langsung dari kamera HP bisa dipakai.

## Kebutuhan

- Node.js 20.19+ atau 22.12+ (CI memakai Node 24)
- UMKM-API yang berjalan (default `http://localhost:8000`). Cara menyiapkannya ada di README UMKM-API.

## Menjalankan

```bash
cd UMKM-APP
npm install
cp .env.example .env   # sesuaikan VITE_API_URL
npm run dev
```

Buka **http://localhost:5173** lalu masuk dengan akun admin dari seeder.

| Perintah          | Fungsi                        |
| ----------------- | ----------------------------- |
| `npm run dev`     | Server pengembangan Vite      |
| `npm run lint`    | ESLint                        |
| `npm run build`   | Build produksi ke `dist/`     |
| `npm run preview` | Menjalankan hasil build lokal |

## Konfigurasi

| Variabel       | Contoh                      | Keterangan              |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | `http://localhost:8000/api` | Alamat REST API Laravel |

Variabel `VITE_*` ikut masuk ke bundle JavaScript dan bisa dibaca siapa pun, jadi jangan menaruh rahasia di sini.

## Struktur

```
src/
  pages/             halaman per menu (admin/Dashboard, produk, kategori, profil, laporan, auth/Login)
  components/        Header, Sidebar, FullPageSpinner
  layouts/           DashboardLayout, ProtectedRoute (wajib login), GuestRoute (khusus belum login)
  contexts/          AuthContext: status login dan token
  services/          pemanggilan API per fitur; api.js menambahkan token dan menangani 401
  utils/             formatRupiah, keuangan (ringkasan dan data grafik), pesanError (pesan dari API)
vercel.json          rewrite SPA untuk Vercel
```

Form produk dan kategori dibuka sebagai modal dari halaman daftarnya. Pesan error validasi berasal dari API dan sudah berbahasa Indonesia.

## Deploy

Produksi ada di Vercel (`umkm-app-bundariris.vercel.app`) dan otomatis deploy setiap ada push ke `main`. `VITE_API_URL` untuk produksi diatur di **Settings → Environment Variables** project Vercel. Domain dashboard juga harus terdaftar di `config/cors.php` UMKM-API.

## Pengecekan otomatis

GitHub Actions (`.github/workflows/ci.yml`) menjalankan `npm ci`, `npm run lint`, dan `npm run build` di setiap PR dan setiap push ke `main`. Merge PR sebaiknya menunggu tanda hijau di tab **Checks**.
