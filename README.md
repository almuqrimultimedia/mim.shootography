# MiM Shootography

Website portofolio dan portal kerja studio foto yang siap diunggah ke Vercel.

## Halaman

- `index.html` — beranda dan portofolio.
- `select.html` — portal seleksi foto klien (terbuka).
- `demo.html` — penjelasan dan demo produk.
- `login.html` / `daftar.html` — akun studio.
- `dashboard.html` — pusat aplikasi.
- `sorter.html` dan `generator-link.html` — aplikasi premium.

Seluruh halaman—Beranda, Login, Daftar, Demo, Dashboard, Seleksi Foto, Sorter, dan Generator Link—memakai desain slate/blue yang seragam, latar grid, serta mode terang/gelap. Pilihan tema tersimpan otomatis di browser. Setiap aplikasi juga menyediakan tombol Home untuk kembali ke beranda.

## Deploy ke Vercel

1. Ekstrak ZIP ini.
2. Impor folder proyek ke Vercel atau jalankan Vercel CLI dari folder ini.
3. Framework Preset: **Other**.
4. Build Command dan Output Directory boleh dibiarkan kosong.

File `vercel.json` sudah disiapkan dan clean URL tetap aktif.

## Pengaturan studio

Nama studio, Google Drive API key, dan nomor WhatsApp untuk portal seleksi berada di `pengaturan.js`.

## Catatan penting

Versi ini menggunakan akun browser (`localStorage`) agar dapat berjalan sebagai website statis. Artinya, registrasi dan status pembayaran tersimpan pada perangkat/browser masing-masing, bukan database pusat. Untuk penjualan publik dengan aktivasi lintas perangkat dan keamanan produksi, sambungkan login serta pembayaran ke backend/database.

Foto portofolio pada beranda diambil dari postingan publik Instagram `@mim.shootography` pada saat website dibuat dan disimpan lokal di folder `assets` agar tampil stabil di Vercel.

Galeri portofolio memakai susunan masonry yang diacak setiap halaman dibuka. Semua kartu dibatasi pada tiga rasio yang konsisten: 1:1, 16:9, dan 4:5.
