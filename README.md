# webUMKM

**Platform pembuat website untuk UMKM.**

webUMKM adalah aplikasi web yang membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) membuat dan mengelola website bisnis mereka dengan lebih mudah.

## ✨ Fitur

- **Buat Website** — Membuat website bisnis UMKM.
- **Preview Website** — Melihat tampilan website sebelum dipublikasikan.
- **Halaman Publik** — Website dapat diakses melalui URL berdasarkan slug.
- **Dashboard Admin** — Mengelola data dan aktivitas platform.
- **Manajemen Pelanggan** — Melihat dan mengelola data pelanggan.
- **Manajemen Website** — Mengelola website yang dibuat pengguna.
- **Manajemen Pesanan** — Melihat dan mengelola pesanan.
- **Pembayaran** — Halaman pembayaran dan preview pembayaran.
- **Responsive UI** — Tampilan yang menyesuaikan ukuran layar perangkat.

## 🛠️ Teknologi

- Next.js
- React
- TypeScript
- CSS
- npm

## 🚀 Instalasi

Pastikan Node.js dan npm sudah terpasang di komputer.

1. Clone repository:

   ```bash
   git clone https://github.com/USERNAME/REPOSITORY.git
   ```

2. Masuk ke folder project:

   ```bash
   cd umkm-website-generator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka browser dan akses:

   ```text
   http://localhost:3000
   ```

## 📦 Build

Untuk membuat production build:

```bash
npm run build
```

Untuk menjalankan production server:

```bash
npm run start
```

## 🌐 Deployment

Project ini disiapkan untuk pengembangan dan deployment aplikasi web. Konfigurasi deployment perlu disesuaikan dengan environment dan layanan hosting yang digunakan.

## 📁 Struktur Project

```text
umkm-website-generator/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── buat-website/
│   │   ├── pembayaran/
│   │   ├── preview/
│   │   ├── preview-pembayaran/
│   │   └── s/
│   └── components/
├── public/
├── package.json
└── README.md
```

## 🔒 Environment Variables

Jika project membutuhkan konfigurasi environment, buat file `.env.local` berdasarkan variabel yang digunakan aplikasi.

**Jangan pernah mengunggah API key, password, token, atau informasi rahasia ke repository publik.**

## 📌 Status Project

Project ini masih dalam tahap pengembangan. Fitur dan konfigurasi dapat berubah seiring proses pengembangan.

---

Dibuat untuk membantu UMKM memiliki kehadiran digital dan mengembangkan bisnis secara online.

**webUMKM — Digitalisasi UMKM, Lebih Mudah.**
