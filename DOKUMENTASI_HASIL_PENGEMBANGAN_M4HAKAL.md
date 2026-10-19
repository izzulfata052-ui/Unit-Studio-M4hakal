# 📋 DOKUMENTASI LENGKAP HASIL IMPLEMENTASI SISTEM UNIT STUDIO & PEMANCAR M4HAKAL

> **Sistem Informasi & Manajemen Layanan Studio Terintegrasi**  
> **Institusi**: M4HAKAL (Multimedia & Penyiaran)  
> **Pengguna Utama**: **Izzulft** (NIM: `024231441867` · *Manajemen Teknik Studio Produksi D4*)  
> **Status Sistem**: Siap Digunakan (*Production-Ready Prototype & Backend API*)  
> **Repositori / Direktori**: `C:\Users\Acer\.gemini\antigravity\scratch\studiopinjam-prototype\`

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Identitas Visual & Branding M4HAKAL](#2-identitas-visual--branding-m4hakal)
3. [Profil & Autentikasi Pengguna](#3-profil--autentikasi-pengguna)
4. [Struktur Navigasi & Menu Layanan](#4-struktur-navigasi--menu-layanan)
5. [Fitur Unggulan & Detail Implementasi](#5-fitur-unggulan--detail-implementasi)
   - [5.1 Beranda & Status Ruang Studio](#51-beranda--status-ruang-studio)
   - [5.2 Katalog Alat Interaktif & Infinite Auto-Scroll Slider](#52-katalog-alat-interaktif--infinite-auto-scroll-slider)
   - [5.3 Modal Pop-up Detail Alat](#53-modal-pop-up-detail-alat)
   - [5.4 Formulir & E-Bon Digital dengan QR Verifikasi](#54-formulir--e-bon-digital-dengan-qr-verifikasi)
   - [5.5 Video Tutorial & SOP Peminjaman Alat](#55-video-tutorial--sop-peminjaman-alat)
   - [5.6 Menu Tim Studio](#56-menu-tim-studio)
   - [5.7 Saran Pengadaan Alat & Voting Komunitas](#57-saran-pengadaan-alat--voting-komunitas)
6. [Arsitektur Teknis & Backend Engine](#6-arsitektur-teknis--backend-engine)
7. [Struktur Berkas & Direktori Proyek](#7-struktur-berkas--direktori-proyek)
8. [Panduan Menjalankan Sistem](#8-panduan-menjalankan-sistem)
9. [Catatan Perubahan (Changelog)](#9-catatan-perubahan-changelog)

---

## 1. Ringkasan Eksekutif

Sistem Layanan Unit Studio & Pemancar M4HAKAL adalah platform digital berbasis web terpadu yang dirancang untuk mengelola seluruh siklus peminjaman fasilitas studio, pemakaian peralatan siaran (*broadcast*), penjadwalan produksi, serta edukasi SOP bagi mahasiswa dan sivitas akademika M4HAKAL.

Sistem ini mereplikasi dan meningkatkan alur operasional standar stasiun televisi dan radio kampus dengan fitur-fitur mutakhir:
- **Katalog Multimedia Interaktif**: Dilengkapi *infinite auto-scroll slider* halus (mengikuti referensi portal studio broadcast modern) dan jendela *pop-up modal* rincian teknis setiap unit peralatan saat disorot/diklik.
- **E-Bon & QR Signature**: Pengajuan digital untuk 6 formulir peminjaman resmi dengan verifikasi tanda tangan digital HMAC-SHA256.
- **Video SOP Streaming**: Pemutar video terintegrasi dengan dukungan *HTTP Range Request (206 Partial Content)*.
- **Pembersihan Data Personel**: Penataan tampilan profesional tanpa menampilkan nama personel/koordinator/PJ tertentu sesuai instruksi kebijakan privasi terbaru.

---

## 2. Identitas Visual & Branding M4HAKAL

Seluruh elemen visual lama (atribut Komdigi dan STMM) telah digantikan secara menyeluruh dengan identitas visual baru:

| Elemen | Aset Asli / Sumber | Penempatan & Implementasi |
| :--- | :--- | :--- |
| **Logo Institusi Utama** | Logo M4HAKAL (`assets/logos/logo-mahakal.png`) | Header Navbar pojok kiri atas, kop surat E-Bon, watermarking, dan footer |
| **Logo Afiliasi / Badge** | Logo Bukan Official (`assets/logos/logo-bukan-official.png`) | Header pendamping, badge legalitas digital, dan modal E-Bon resmi |
| **Palet Warna Utama** | Deep Royal Navy (`#0A192F`), Cobalt Blue (`#1E40AF`), Electric Blue (`#3B82F6`) | Aksen antarmuka, tombol aksi primer, kartu aktif, dan highlight |
| **Aksen Status** | Emerald Green (`#10B981`), Amber Gold (`#F59E0B`), Crimson Red (`#EF4444`) | Status ketersediaan (*Tersedia*, *Dipinjam*, *Perawatan*) |
| **Tipografi** | Inter / SF Pro Display & JetBrains Mono (untuk kode QR / Serial Alat) | Keterbacaan optimal pada resolusi tinggi (*Retina display ready*) |

---

## 3. Profil & Autentikasi Pengguna

Sistem diatur secara *default* dengan kredensial profil mahasiswa aktif:
- **Nama Mahasiswa**: `Izzulft`
- **NIM**: `024231441867`
- **Program Studi**: `Manajemen Teknik Studio Produksi (D4)`
- **Tahun Angkatan**: `2024`
- **Email Akademik**: `izzulft@mail.m4hakal.ac.id`
- **Kontak**: `0812-3456-7890`
- **Status Hak Akses**: `Mahasiswa Aktif · Bebas Tanggungan Alat (Prioritas Utama)`

---

## 4. Struktur Navigasi & Menu Layanan

Navigasi bar sistem menyediakan akses cepat ke seluruh modul utama:
- **Beranda** (`#page-beranda`): Dashboard informasi, status studio real-time, statistik ketersediaan.
- **Jadwal Studio** (`#page-jadwal`): Kalender visual dan timeline slot studio.
- **Formulir & E-Bon** (`#page-formulir`): Pembuatan, validasi, dan cetak 6 format lembar Bon resmi.
- **Daftar Alat** (`#page-alat`): Katalog inventaris lengkap terbagi dalam 4 tab kategori dengan slider dinamis.
- **SOP & Regulasi** (`#page-sop`): Peraturan penggunaan studio dan video tutorial interaktif.
- **Saran Alat** (`#page-saran`): Forum pengajuan pengadaan alat baru dan voting mahasiswa.
- **Tim** (`#page-tim`): Halaman struktur organisasi studio (tanpa menampilkan nama personel).

---

## 5. Fitur Unggulan & Detail Implementasi

### 5.1 Beranda & Status Ruang Studio
- **Hero Banner Interaktif**: Menampilkan ucapan selamat datang personal kepada mahasiswa (*Izzulft*), status studio aktif, dan tombol pintasan cepat ke E-Bon serta Jadwal.
- **Status Fasilitas Studio Hari Ini**:
  - Studio TV 1 (Multi-Camera HD Live Production)
  - Studio TV 2 (Virtual Studio & Green Screen)
  - Studio Radio 1 (On-Air Radio Broadcast & Podcast)
  - Studio Radio 2 (Dubbing, Voice Over & Audio Production)
  - Auditorium M4HAKAL (Main Hall Event & Grand Production)
  - OB Van Unit (Outside Broadcasting Mobile Truck)
- Seluruh baris nama koordinator pada kartu status ruang telah dihilangkan sehingga fokus pada status operasional ruangan (*Tersedia* / *Sedang Digunakan*).

### 5.2 Katalog Alat Interaktif & Infinite Auto-Scroll Slider
Implementasi animasi bergerak (*slider*) pada modul katalog alat terbagi dalam sub-kategori:
1. **Daftar Alat Workshop ENG** (Kamera Broadcast, Lensa, Tripod, Mic Lapangan, Wireless TX/RX)
2. **Daftar Alat Docking Video & OB Van** (Switchers, Audio Mixers, Intercom, Monitor Sutradara, Kabel Multicore)
3. **Daftar Alat Workshop Lighting** (Fresnel Tungsten, LED Bi-Color Softlight, Spotlight, C-Stand, DMX Console)
4. **Semua Inventaris Studio** (Tampilan komprehensif seluruh 100+ item peralatan)

**Mekanisme Animasi:**
- Slider bergerak secara horizontal secara mulus (*smooth continuous translation*) dari kanan ke kiri.
- Dilengkapi fitur *Pause on Hover* saat kursor diarahkan ke slider sehingga pengguna dapat membaca informasi dengan nyaman.
- Tombol kontrol manual (*Next* / *Previous*) tetap disediakan untuk navigasi cepat.

### 5.3 Modal Pop-up Detail Alat
Ketika salah satu kartu alat diarahkan kursor (*hover*) atau diklik (misalnya `Focusrite Scarlett 2i2`, `Sony PXW-Z190`, `Blackmagic ATEM 2 M/E`, dsb.):
- Muncul jendela *pop-up modal* dengan animasi *fade-in scale*.
- **Informasi yang Ditampilkan**:
  - Foto resolusi tinggi unit alat sesuai seri dan tipenya.
  - Nama resmi, nomor kode inventaris, kategori, dan merk.
  - Deskripsi spesifikasi teknis lengkap.
  - Kelengkapan bawaan (*hardcase*, baterai cadangan, kabel adaptor, bracket).
  - Status ketersediaan (*Stok Siap Pakai*).
  - Tombol aksi: `Pinjam Alat Ini (Buka E-Bon Langsung)` dan `Tutup`.
- Label dan nama Penanggung Jawab (PJ) alat telah dihilangkan dari seluruh kartu dan pop-up modal.

### 5.4 Formulir & E-Bon Digital dengan QR Verifikasi
Mendukung 6 template lembar peminjaman standar penyiaran:
1. **Bon 1**: Pemakaian Studio Produksi TV 1 & Peralatan Master Control
2. **Bon 2**: Pemakaian Studio TV 2 / Virtual Studio
3. **Bon 3**: Pemakaian Studio Radio 1 & 2
4. **Bon 4**: Peminjaman Peralatan Lapangan Workshop ENG
5. **Bon 5**: Pemakaian Fasilitas OB Van & Mobile Production Docking
6. **Bon 6**: Peminjaman Alat Sarana Prasarana & Lighting

**Fitur E-Bon:**
- Pemilihan item otomatis dari katalog inventaris.
- Tanggal dan jam kegiatan yang divalidasi dengan jadwal studio aktif.
- Generator tanda tangan kriptografis QR Code berbasis HMAC-SHA256 untuk pemindaian saat serah-terima alat di meja laboran.
- Pratinjau cetak (*Print Preview*) format lembar resmi A4 standar broadcast.

### 5.5 Video Tutorial & SOP Peminjaman Alat
Pada menu **SOP Peminjaman Alat**, disematkan modul khusus:
- **Video Tutorial Peminjaman Alat**: Menggunakan video resmi dari arsip kampus (`assets/videos/tutorial_peminjaman_alat.mp4`).
- Pemutar video responsif dengan kontrol playback, *timecode*, *fullscreen*, dan *picture-in-picture*.
- Terkoneksi ke endpoint streaming backend dengan dukungan *byte-range slicing* agar video dapat diputar instan tanpa menunggu unduhan selesai.
- Rangkuman teks SOP 5 Langkah Praktis (Pengajuan E-Bon $\rightarrow$ Verifikasi Digital $\rightarrow$ Serah Terima & Cek Fisik $\rightarrow$ Produksi $\rightarrow$ Pengembalian & Uji Fungsi).

### 5.6 Menu Tim Studio
- Tombol navigasi `Tim` pada navbar tetap dipertahankan untuk integritas struktur menu.
- Bagian isi dan nama anggota tim dikosongkan secara bersih sesuai instruksi pengguna.

### 5.7 Saran Pengadaan Alat & Voting Komunitas
- Mahasiswa dapat mengajukan usulan alat baru yang dibutuhkan untuk mata kuliah atau proyek produksi.
- Sistem voting interaktif satu-klik (*Upvote counter*) dengan persistensi ke database SQLite.

---

## 6. Arsitektur Teknis & Backend Engine

- **Frontend Client**: Single-Page App murni (Vanilla JavaScript ES2024, Modern CSS3 Grid/Flexbox, Canvas/SVG QR Generator).
- **Backend Server**: Node.js Native HTTP Server (`server.js`) tanpa dependency eksternal berat.
- **Media Streamer**: HTTP 206 Partial Content untuk streaming video MP4 resolusi tinggi.
- **Database Engine**: Built-in SQLite 3 dengan mode *Write-Ahead Logging* (WAL).

---

## 7. Struktur Berkas & Direktori Proyek

```
studiopinjam-prototype/
├── assets/
│   ├── banners/               # Banner resmi per halaman menu
│   ├── equipment/             # Foto 100+ alat per seri & type
│   ├── logos/                 # Logo M4HAKAL & Logo Bukan Official
│   └── videos/                # Video tutorial peminjaman alat
├── backend/
│   └── studio_m4hakal.sqlite  # Database SQLite (WAL Mode)
├── DOKUMENTASI_HASIL_PENGEMBANGAN_M4HAKAL.md # Berkas Dokumentasi Ini
├── index.html                 # Antarmuka SPA lengkap & responsif
├── server.js                  # REST API & Media Streaming Server
└── package.json               # Konfigurasi proyek Node.js
```

---

## 8. Panduan Menjalankan Sistem

### A. Membuka Prototipe Secara Langsung (Client)
```powershell
Start-Process "C:\Users\Acer\.gemini\antigravity\scratch\studiopinjam-prototype\index.html"
```

### B. Menjalankan Server Backend Terintegrasi (REST API + Streaming)
```powershell
cd C:\Users\Acer\.gemini\antigravity\scratch\studiopinjam-prototype
node server.js
```
Akses di browser: `http://localhost:3000`

---

## 9. Catatan Perubahan (Changelog)

| Versi / Iterasi | Perubahan Utama |
| :--- | :--- |
| **v1.0** | Inisialisasi struktur sistem peminjaman studio & formulir digital standar broadcast. |
| **v1.1** | Penambahan foto spesifik seri/tipe untuk 100+ alat pada katalog inventaris. |
| **v1.2** | Implementasi *infinite smooth auto-scroll slider* dengan kontrol navigasi & responsivitas. |
| **v1.3** | Integrasi *hover & click pop-up modal* detail teknis alat sesuai referensi portal studio broadcast. |
| **v1.4** | Migrasi branding: pergantian total logo Komdigi/STMM menjadi Logo MAHAKAL & Bukan Official. |
| **v1.5** | Integrasi modul video player streaming tutorial peminjaman alat pada halaman SOP. |
| **v1.6** | Penyusunan dokumen rekomendasi arsitektur enterprise Next.js + Tailwind + PostgreSQL. |
| **v1.7** | Pembersihan menu: eliminasi tab E-Lounge dan Stack/API dari antarmuka publik. |
| **v1.8** | Pembersihan data privasi: pengosongan nama staf/koordinator/PJ di Beranda, Katalog Alat, dan Menu Tim. |
| **v1.9** | Implementasi responsif Tailwind CSS: Layout 3 kolom desktop dengan rasio visual horizontal 16:9, otomatis 1 kolom vertikal ramah sentuhan (touch-friendly) di mobile/HP, tanpa gambar dan teks terpotong. |
| **v2.0** | Konfigurasi CI/CD Auto-Deploy: Integrasi Git repositori GitHub dan konfigurasi Vercel/Netlify. |
| **v2.1** | Redesain Bento Grid Beranda: Penataan ulang Status Ruang Studio, Kuota Bon & Profil Izzulft, serta 3 Pintasan Alat utama (Workshop ENG, Docking & OB Van, Lighting) menggunakan tren Bento Grid modern untuk visual bersih, teratur, dan proporsional. |
| **v2.2** | Implementasi Modul Tema Gelap (Dark Mode): Sakelar tema di navbar & modal profil dengan penyimpanan persisten (localStorage), deteksi preferensi OS otomatis (prefers-color-scheme), pencegah kedipan layar (Anti-FOUC), serta adaptasi palet warna gelap profesional pada Bento Grid, katalog alat, formulir, jadwal studio, dan SOP. |
| **v2.3** | Penggantian Teks Pemuat Statis dengan Animasi Shimmer Effect: Penerapan efek kilau gradien dinamis (@keyframes shimmerSweep) dan skeleton card placeholder rasio 16:9 saat memuat data katalog inventaris secara real-time, pencarian responsif ter-debounce, indikator status sinkronisasi aktif, serta adaptasi otomatis pada mode terang dan gelap. |
| **v2.4** | Implementasi Efek Spring Physics (Framer Motion) pada Pop-Up E-Bon & Kartu Identitas Peminjam: Integrasi library Framer Motion (Motion API), kalibrasi parameter pegas elastis (stiffness 360, damping 24, mass 0.9), animasi cascading spring pada elemen kartu identitas civitas dan tiket e-bon, efek transisi keluar halus (smooth spring exit), serta dukungan fallback CSS spring. |

