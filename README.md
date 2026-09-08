<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/151AyKveTWPqenGDEr49yAbI5JO6EWGg-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# NESA Backend (Flask)

## Setup (Dev)

1. Buat dan aktifkan virtualenv:
    ```
    python3 -m venv venv
    source venv/bin/activate
    ```
2. Install requirements:
    ```
    pip install -r requirements.txt
    ```
3. Buat file `.env` (copy dari contoh di atas), isi dengan kredensial MySQL Anda.
4. Jalankan local:
    ```
    python app.py
    ```

## Deployment (CPanel)
- Gunakan `wsgi.py` sebagai entry point aplikasi Python.
- Upload semua file/folder ke hosting (kecuali venv).
- Pastikan requirements sudah terinstall di Python App CPanel.
- Atur environment variable sesuai isi `.env`.

## Struktur Folder
- app/ — source utama (config, models, routes, utils, dsb)
- app.py — untuk local dev
- wsgi.py — untuk deployment cPanel
- .env — config sensitive (jangan commit ke git!)




# Panduan Pemasangan Aset Branding Sekolah

> Panduan ini dibuat berdasarkan struktur project yang sebenarnya.
> Semua path, nama file, dan instruksi kode mengacu pada implementasi aktual project ini.

---

## Daftar Isi

1. [Gambaran Umum Sistem Aset](#1-gambaran-umum-sistem-aset)
2. [Struktur Folder Aset](#2-struktur-folder-aset)
3. [Daftar Aset yang Perlu Dipasang](#3-daftar-aset-yang-perlu-dipasang)
4. [Favicon](#4-favicon)
5. [Logo untuk Navbar / Header](#5-logo-untuk-navbar--header)
6. [Logo untuk Footer](#6-logo-untuk-footer)
7. [Logo untuk Halaman Login](#7-logo-untuk-halaman-login)
8. [Logo untuk Backend (Halaman Unit & Fallback)](#8-logo-untuk-backend-halaman-unit--fallback)
9. [Open Graph & Social Media Preview Image](#9-open-graph--social-media-preview-image)
10. [Schema.org (SEO Terstruktur)](#10-schemaorg-seo-terstruktur)
11. [Mengganti Logo Tanpa Merusak Layout](#11-mengganti-logo-tanpa-merusak-layout)
12. [Cara Memastikan Aset Ter-load Setelah Build/Deploy](#12-cara-memastikan-aset-ter-load-setelah-builddeploy)
13. [Troubleshooting: Logo atau Favicon Tidak Muncul](#13-troubleshooting-logo-atau-favicon-tidak-muncul)

---

## 1. Gambaran Umum Sistem Aset

Project ini adalah **SPA (Single Page Application)** berbasis **React + TypeScript + Vite**.

Ada **dua lokasi penyimpanan aset** yang perlu dipahami:

| Lokasi | URL Akses | Keterangan |
|---|---|---|
| `frontend/public/` | `/nama-file.ext` (root URL) | Aset statis frontend — dikelola Vite |
| `backend/public/img/` | `http://localhost:5001/public/img/nama-file` | Aset yang diupload/dikelola backend — diakses via API URL |

**Favicon** dan **logo untuk navbar/footer** sebaiknya diletakkan di `frontend/public/` agar bisa diakses langsung oleh browser tanpa bergantung pada backend server.

**Logo yang sudah ada** saat ini berada di `backend/public/img/logo.png` dan diakses via URL backend. Logo tersebut digunakan di halaman Login dan beberapa halaman Unit.

---

## 2. Struktur Folder Aset

Berikut adalah struktur folder yang direkomendasikan setelah semua aset dipasang:

```
esemkapekape1-main/
├── frontend/
│   ├── public/                  ← Aset statis frontend (dikelola Vite)
│   │   ├── favicon.ico          ← Favicon utama (format ICO, wajib)
│   │   ├── favicon.png          ← Favicon alternatif (format PNG)
│   │   ├── logo.png             ← Logo sekolah untuk navbar & footer
│   │   ├── logo.svg             ← Logo sekolah versi SVG (opsional, lebih tajam)
│   │   ├── logo-white.png       ← Logo versi putih (untuk navbar saat scroll / footer)
│   │   ├── apple-touch-icon.png ← Icon untuk iOS homescreen
│   │   └── .htaccess            ← (sudah ada, jangan diubah)
│   ├── index.html               ← Tambahkan tag favicon & meta OG di sini
│   ├── components/
│   │   ├── Header.tsx           ← Ganti placeholder teks 'PKP' dengan <img>
│   │   └── Footer.tsx           ← Ganti placeholder teks 'PKP' dengan <img>
│   └── pages/
│       └── Login.tsx            ← Ganti src logo agar tidak hardcode localhost
│
└── backend/
    └── public/
        └── img/
            └── logo.png         ← Logo yang sudah ada (digunakan halaman unit)
```

---

## 3. Daftar Aset yang Perlu Dipasang

| Aset | File yang Direkomendasikan | Format | Ukuran / Dimensi | Lokasi |
|---|---|---|---|---|
| Favicon browser | `favicon.ico` | ICO (multi-size) | 16×16, 32×32, 48×48 px | `frontend/public/` |
| Favicon PNG modern | `favicon.png` | PNG | 32×32 px | `frontend/public/` |
| Apple Touch Icon | `apple-touch-icon.png` | PNG | 180×180 px | `frontend/public/` |
| Logo navbar (terang) | `logo.png` | PNG / SVG | Tinggi maks 48 px, lebar proporsional | `frontend/public/` |
| Logo navbar (putih) | `logo-white.png` | PNG / SVG | Sama dengan logo utama | `frontend/public/` |
| Logo footer | `logo.png` | PNG / SVG | Sama dengan logo utama | `frontend/public/` |
| Logo login page | `logo.png` | PNG | 80×80 px | `backend/public/img/` |
| OG Image (social preview) | `og-image.png` | PNG / JPG | 1200×630 px | `backend/public/uploads/` |
| Logo fallback (halaman unit) | `logo.png` | PNG | Bebas, min 200 px wide | `backend/public/img/` |

> **Catatan format SVG**: SVG direkomendasikan untuk navbar dan footer karena hasilnya lebih tajam di semua resolusi layar dan ukuran file lebih kecil. Namun pastikan SVG tidak memiliki background transparan yang menyebabkan logo tidak terlihat di atas background putih atau biru.

---

## 4. Favicon

### Lokasi file
```
frontend/public/favicon.ico
frontend/public/favicon.png          (opsional, untuk browser modern)
frontend/public/apple-touch-icon.png (opsional, untuk iOS)
```

### Cara memasang

Buka file **`frontend/index.html`**, tambahkan tag berikut di dalam `<head>`, **setelah baris `<meta charset="UTF-8" />`**:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

Saat ini `index.html` **belum memiliki tag favicon sama sekali**, sehingga browser akan menampilkan icon default. Menambahkan tag di atas sudah cukup untuk menampilkan favicon.

### Lokasi persis di index.html untuk menambahkan tag

Tambahkan tepat setelah baris ini (sekitar baris 4–5):
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- ← TAMBAHKAN TAG FAVICON DI SINI -->
<title>SMK PKP 1 Jakarta Islamic School</title>
```

### Format ICO yang direkomendasikan

File `.ico` idealnya berisi **3 ukuran sekaligus** (multi-size): 16×16, 32×32, dan 48×48 px. Banyak tool online seperti [favicon.io](https://favicon.io) atau [realfavicongenerator.net](https://realfavicongenerator.net) yang bisa membuat file `.ico` dari logo PNG.

---

## 5. Logo untuk Navbar / Header

### File terkait
```
frontend/components/Header.tsx
frontend/public/logo.png       ← letakkan file logo di sini
frontend/public/logo-white.png ← versi putih untuk saat header biru (setelah scroll)
```

### Kondisi saat ini

Header saat ini menampilkan **teks placeholder** `"PKP"` di dalam kotak berwarna, bukan gambar logo. Ini ada di dua kondisi:

1. **Header putih** (saat halaman baru dibuka, sebelum scroll) — logo box berwarna biru `bg-primary`
2. **Header biru** (setelah user scroll) — logo box menjadi semi-transparan `bg-white/15`

Kode yang perlu diubah ada di **`frontend/components/Header.tsx`**, bagian **Logo** (sekitar baris 71–84):

```tsx
{/* SEBELUM — placeholder teks */}
<div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm shrink-0 transition-colors duration-300
    ${scrolled ? 'bg-white/15 border border-white/20' : 'bg-primary shadow-blue-glow/30'}`}>
    <span className={`font-black text-sm leading-none transition-colors duration-300 ${scrolled ? 'text-white' : 'text-white'}`}>
        PKP
    </span>
</div>
```

```tsx
{/* SESUDAH — gunakan gambar logo */}
<div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shrink-0">
    <img
        src={scrolled ? "/logo-white.png" : "/logo.png"}
        alt="Logo SMK PKP 1 Jakarta"
        className="w-full h-full object-contain"
    />
</div>
```

> **Jika hanya tersedia satu versi logo** (tanpa versi putih), gunakan logo tunggal dengan sedikit modifikasi — tambahkan background putih semi-transparan di container agar logo tetap terlihat di atas background biru:
>
> ```tsx
> <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white p-1">
>     <img src="/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-full h-full object-contain" />
> </div>
> ```

### Mobile drawer header

Logo yang sama juga muncul di drawer menu mobile (baris ~206–215 di Header.tsx):

```tsx
{/* SEBELUM */}
<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 border border-white/20">
    <span className="text-white font-black text-xs">PKP</span>
</div>

{/* SESUDAH */}
<div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-0.5">
    <img src="/logo-white.png" alt="Logo" className="w-full h-full object-contain" />
</div>
```

### Dimensi yang direkomendasikan

- **logo.png** (versi gelap/penuh): minimal **200×200 px**, lebih baik **400×400 px**, background transparan (PNG)
- **logo-white.png** (versi putih/monochrome): dimensi sama, semua elemen berwarna putih

---

## 6. Logo untuk Footer

### File terkait
```
frontend/components/Footer.tsx
frontend/public/logo.png        ← file yang sama dengan navbar
frontend/public/logo-white.png  ← lebih cocok untuk footer berlatar gelap
```

### Kondisi saat ini

Footer juga menggunakan **teks placeholder** `"PKP"` di dalam kotak. Ini ada di bagian **Col 1 — Brand** (sekitar baris 43–50 di Footer.tsx):

```tsx
{/* SEBELUM */}
<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 group-hover:bg-white/15 transition-colors shrink-0">
    <span className="text-white font-black text-sm leading-none">PKP</span>
</div>

{/* SESUDAH */}
<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 overflow-hidden p-1.5">
    <img
        src="/logo-white.png"
        alt="Logo SMK PKP 1 Jakarta"
        className="w-full h-full object-contain"
    />
</div>
```

> Footer berlatar biru gelap, sehingga **logo versi putih** (`logo-white.png`) jauh lebih terlihat daripada logo penuh warna.

---

## 7. Logo untuk Halaman Login

### File terkait
```
backend/public/img/logo.png   ← file yang sudah ada di sini
frontend/pages/Login.tsx      ← kode yang perlu diperbarui (opsional)
```

### Kondisi saat ini

Halaman Login sudah menggunakan tag `<img>` dengan logo, namun src-nya **hardcoded ke URL backend localhost**:

```tsx
// frontend/pages/Login.tsx, sekitar baris 30
<img src="http://localhost:5001/public/img/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-20 h-20 mx-auto mb-4" />
```

### Opsi A — Ganti ke frontend/public (direkomendasikan untuk produksi)

1. Salin `logo.png` ke folder `frontend/public/logo.png`
2. Ubah src di `Login.tsx`:

```tsx
<img src="/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-20 h-20 mx-auto mb-4 object-contain" />
```

### Opsi B — Tetap gunakan backend, ganti URL hardcode

Jika logo tetap ingin diambil dari backend, ganti URL agar menggunakan konstanta `API_BASE_URL` yang sudah ada di project:

```tsx
// Tambahkan import di atas file
import { API_BASE_URL } from '../constants';

// Lalu gunakan di src
<img src={`${API_BASE_URL}/public/img/logo.png`} alt="Logo SMK PKP 1 Jakarta" className="w-20 h-20 mx-auto mb-4 object-contain" />
```

`API_BASE_URL` didefinisikan di `frontend/constants.ts` dan nilainya adalah `http://localhost:5001`.

### Dimensi untuk logo Login

Ditampilkan dengan ukuran **80×80 px** (class `w-20 h-20`). Pastikan logo berukuran minimal **160×160 px** (2× untuk retina/HiDPI).

---

## 8. Logo untuk Backend (Halaman Unit & Fallback)

### File terkait
```
backend/public/img/logo.png  ← sudah ada
```

Logo ini sudah ada dan digunakan sebagai **fallback image** di beberapa halaman unit (`pages/unit/SMAIT.tsx`, `pages/unit/SMPIT.tsx`) dan sebagai logo pada Schema.org metadata. Untuk memperbarui logo ini:

1. Siapkan file logo baru dengan nama **`logo.png`**
2. Salin ke folder **`backend/public/img/`**, timpa file yang sudah ada
3. Backend Flask/Python sudah menyajikan folder ini sebagai static files di URL `http://[domain]/public/img/`

> **Jangan ubah nama file** `logo.png` — banyak bagian kode yang referensi ke nama ini.

---

## 9. Open Graph & Social Media Preview Image

### File terkait
```
backend/public/uploads/1.png  ← file OG image saat ini
frontend/index.html           ← tag meta yang perlu diperbarui
```

### Kondisi saat ini

Tag OG dan Twitter di `index.html` menggunakan gambar dari backend:

```html
<meta property="og:image" content="http://localhost:5001/public/uploads/1.png">
<meta property="twitter:image" content="http://localhost:5001/public/uploads/1.png">
```

### Cara memperbarui

1. Siapkan gambar preview berukuran **1200×630 px** (rasio 1.91:1) — standar OG image
2. Simpan sebagai `og-image.png` di `backend/public/uploads/` atau `frontend/public/`
3. Update `index.html` — ganti kedua tag dengan URL yang sesuai:

```html
<!-- Jika disimpan di frontend/public/ -->
<meta property="og:image" content="https://[domain-produksi]/og-image.png">
<meta property="twitter:image" content="https://[domain-produksi]/og-image.png">

<!-- Jika disimpan di backend/public/uploads/ -->
<meta property="og:image" content="https://[domain-backend]/public/uploads/og-image.png">
<meta property="twitter:image" content="https://[domain-backend]/public/uploads/og-image.png">
```

> Saat development, OG image bisa menggunakan URL localhost. Di produksi, **wajib** menggunakan URL publik yang bisa diakses oleh crawler media sosial.

---

## 10. Schema.org (SEO Terstruktur)

### File terkait
```
frontend/index.html  ← blok <script type="application/ld+json">
```

Saat ini ada referensi logo di Schema.org (sekitar baris 98–115 di `index.html`):

```json
{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "SMK PKP 1 Jakarta Islamic School",
  "logo": "http://localhost:5001/public/img/logo.png",
  ...
}
```

Setelah logo dipasang dan domain produksi tersedia, update nilai `"logo"`:

```json
"logo": "https://[domain-produksi]/logo.png"
```

---

## 11. Mengganti Logo Tanpa Merusak Layout

### Aturan penting

| Aturan | Alasan |
|---|---|
| Gunakan `object-contain` (bukan `object-cover`) | Agar seluruh logo terlihat tanpa terpotong |
| Jangan set `width` dan `height` yang fixed pada `<img>` | Gunakan class Tailwind (`w-10 h-10`) agar proporsional |
| Selalu set `alt` text | Aksesibilitas dan SEO |
| Gunakan PNG dengan background transparan | Agar logo terlihat di semua background (putih, biru, gelap) |
| Tambahkan `loading="eager"` pada logo navbar | Logo navbar harus muncul secepat mungkin |

### Ukuran container di setiap lokasi

| Lokasi | Ukuran container | Class Tailwind |
|---|---|---|
| Navbar desktop | 40×40 px | `w-10 h-10` |
| Navbar mobile drawer | 32×32 px | `w-8 h-8` |
| Footer | 48×48 px | `w-12 h-12` |
| Login page | 80×80 px | `w-20 h-20` |

Logo yang disiapkan harus berukuran minimal **2× dari ukuran tampil** (untuk layar Retina/HiDPI). Misalnya, untuk container 40×40 px, logo harus berukuran minimal **80×80 px**.

---

## 12. Cara Memastikan Aset Ter-load Setelah Build/Deploy

### Development (Vite dev server)

1. Letakkan file di `frontend/public/`
2. Server Vite langsung melayani file tanpa restart
3. Akses di browser: `http://localhost:3000/logo.png`
4. Jika tidak muncul, periksa apakah nama file sudah tepat (case-sensitive di Linux)

### Production build

```bash
# Dari folder frontend/
npm run build
```

Setelah build, semua file di `frontend/public/` akan disalin ke folder `frontend/dist/`. Struktur hasil build:

```
frontend/dist/
├── index.html
├── favicon.ico      ← dari public/
├── favicon.png      ← dari public/
├── logo.png         ← dari public/
├── logo-white.png   ← dari public/
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

### Verifikasi setelah deploy

1. Buka browser, kunjungi `https://[domain]/favicon.ico` — harus muncul gambar favicon
2. Buka `https://[domain]/logo.png` — harus muncul gambar logo
3. Buka DevTools → Network → filter `img` — pastikan semua gambar status `200`, bukan `404`
4. Cek tab browser — favicon harus muncul di tab browser
5. Gunakan [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) untuk memverifikasi OG image

---

## 13. Troubleshooting: Logo atau Favicon Tidak Muncul

### Favicon tidak muncul di tab browser

| Kemungkinan Masalah | Solusi |
|---|---|
| Tag `<link rel="icon">` belum ada di `index.html` | Tambahkan sesuai instruksi di [Bagian 4](#4-favicon) |
| File `favicon.ico` tidak ada di `frontend/public/` | Pastikan file sudah disalin ke lokasi yang benar |
| Browser cache menampilkan favicon lama | Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) |
| Nama file salah atau berbeda kapitalisasi | Periksa nama file — Linux bersifat case-sensitive (`Favicon.ico` ≠ `favicon.ico`) |

### Logo tidak muncul di navbar / footer

| Kemungkinan Masalah | Solusi |
|---|---|
| File belum disalin ke `frontend/public/` | Salin file logo ke `frontend/public/logo.png` |
| Komponen masih menggunakan placeholder teks | Ubah kode di `Header.tsx` dan `Footer.tsx` sesuai instruksi di Bagian 5 dan 6 |
| Path gambar salah | Gunakan path absolut `/logo.png` (mulai dari `/`), bukan path relatif `./logo.png` |
| Logo transparan tidak terlihat di background tertentu | Gunakan versi logo yang sesuai (penuh warna atau putih) |

### Logo tidak muncul di halaman Login

| Kemungkinan Masalah | Solusi |
|---|---|
| Backend server tidak berjalan | Pastikan backend (port 5001) aktif, atau pindah logo ke `frontend/public/` |
| File `logo.png` tidak ada di `backend/public/img/` | Salin file ke `backend/public/img/logo.png` |
| URL hardcode tidak sesuai environment | Gunakan `API_BASE_URL` dari `constants.ts` (lihat Bagian 7, Opsi B) |

### Logo dimuat tapi terlihat terdistorsi atau terpotong

| Kemungkinan Masalah | Solusi |
|---|---|
| `object-cover` memotong gambar | Ganti dengan `object-contain` |
| Dimensi logo terlalu berbeda dari container | Sesuaikan padding container atau gunakan logo dengan rasio mendekati 1:1 |
| Logo tidak transparan | Ekspor ulang logo sebagai PNG dengan background transparan |

### Cara cek cepat dari DevTools

```
1. Buka browser → F12 (DevTools)
2. Tab "Network" → centang "Img"
3. Reload halaman
4. Cari file logo.png atau favicon.ico
5. Status 200 = berhasil; 404 = file tidak ditemukan di path tersebut
```

---

## Ringkasan Langkah Minimal

Untuk memasang logo dan favicon dengan cepat, berikut urutan langkah minimumnya:

```
1. Siapkan file:
   - logo.png          (versi penuh warna, min 400×400 px, background transparan)
   - logo-white.png    (versi semua putih, dimensi sama)
   - favicon.ico       (multi-size: 16, 32, 48 px)

2. Salin ke frontend/public/:
   frontend/public/logo.png
   frontend/public/logo-white.png
   frontend/public/favicon.ico

3. Salin ke backend/public/img/ (untuk login page & fallback):
   backend/public/img/logo.png

4. Edit frontend/index.html — tambahkan tag favicon di <head>

5. Edit frontend/components/Header.tsx — ganti placeholder 'PKP' dengan <img>

6. Edit frontend/components/Footer.tsx — ganti placeholder 'PKP' dengan <img>

7. (Opsional) Edit frontend/pages/Login.tsx — pindahkan src dari backend ke /logo.png

8. Verifikasi di browser — cek favicon di tab dan logo di navbar/footer/login
```

---

*Dokumentasi ini dibuat berdasarkan struktur project aktual pada commit terakhir.*
*Jika ada perubahan struktur file atau komponen, panduan ini perlu disesuaikan.*


---

## Known Issues / Bug Fixes

> Bagian ini mendokumentasikan seluruh bug yang ditemukan dan diperbaiki selama audit BE↔FE.
> Diperbarui setelah sesi audit menyeluruh.

---

### BUG-01 — CRITICAL: "Gagal memuat data dari server" di seluruh halaman

**Status:** ✅ Diperbaiki

**File yang bermasalah:** `backend/.env`

**Gejala:**
- Semua section di homepage (Slider, Sambutan, Kejuruan, Program Unggulan, Berita, dll.) menampilkan pesan error "Gagal memuat data dari server"
- Response dari semua API endpoint backend mengembalikan `{"success": false, "message": "1698 (28000): Access denied for user 'root'@'localhost'"}`
- Berlaku untuk semua endpoint: `/api/slider/`, `/api/jenjang-pendidikan/`, `/api/profil-yayasan/`, dll.

**Root Cause (Trace Lengkap):**

```
Frontend fetch()
  → GET http://localhost:5001/api/jenjang-pendidikan/
  → Backend route jenjang_pendidikan_routes.py → get_all_jenjang()
  → Model jenjang_pendidikan_model.py → get_db()
  → utils/db.py → mysql.connector.connect(user='root', password='', database='alfidaanew')
  → MySQL: ERROR 1698 (28000): Access denied for user 'root'@'localhost'
  → error_response("1698 (28000): Access denied ...", 500)
  → Frontend: !res.ok atau success=false → catch → "Gagal memuat data"
```

**Penyebab spesifik:**
1. File `backend/.env` memiliki nilai yang salah:
   - `MYSQL_USER=root` — user root tidak bisa login via TCP/socket pada sistem ini
   - `MYSQL_DB=alfidaanew` — nama database salah (nama sebenarnya: `bizpromy_alfidaanew`)
2. `config.py` membaca `.env` dengan benar, namun nilai di `.env` salah sejak awal
3. MySQL root user memiliki `authentication_string = 'invalid'` — root tidak bisa digunakan

**Database yang benar:** `bizpromy_alfidaanew`  
**User yang benar:** `ardanau` (OS user, autentikasi tanpa password via Unix socket)

**Perbaikan yang dilakukan:**

File `backend/.env` diubah dari:
```env
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=alfidaanew
```

Menjadi:
```env
MYSQL_USER=ardanau
MYSQL_PASSWORD=
MYSQL_DB=bizpromy_alfidaanew
```

**Setelah perbaikan:**
- Semua 17 endpoint API mengembalikan `{"success": true}` dengan data nyata
- Slider, berita, sambutan, kejuruan, dan semua section homepage memuat data dari database

**Catatan untuk environment lain (staging/production):**
Jika deploy ke server lain, pastikan `.env` diisi dengan kredensial MySQL yang sesuai di server target. Jangan commit file `.env` ke Git (sudah ada di `.gitignore`).

---

### BUG-02 — MEDIUM: Wrong storage path di NewsCard.tsx untuk gambar berita

**Status:** ✅ Diperbaiki

**File:** `frontend/components/NewsCard.tsx`

**Gejala:**
- Gambar berita yang diupload secara lokal (path relatif, bukan URL absolut) tidak tampil
- Gambar yang menggunakan URL absolut dari production (`https://api-alfidaanew.bizpro.my.id/...`) tetap tampil

**Root Cause:**
```tsx
// SALAH — path ini tidak ada di backend
`http://localhost:5001/storage/berita-artikel/${article.image}`

// Backend hanya menyajikan file di:
// http://localhost:5001/public/uploads/{filename}
```

Backend (`app/__init__.py`) mendefinisikan `UPLOAD_FOLDER = 'public/uploads'` dan route `@app.route('/public/uploads/<filename>')`. Tidak ada route `/storage/`.

**Perbaikan:**
```tsx
// BENAR
`http://localhost:5001/public/uploads/${article.image}`
```

---

### BUG-03 — MEDIUM: Wrong storage path di MateriCard.tsx

**Status:** ✅ Diperbaiki

**File:** `frontend/components/MateriCard.tsx`

**Gejala:**
- Gambar materi ajar yang diupload lokal tidak tampil

**Root Cause:**
```tsx
// SALAH
const STORAGE_URL = 'http://localhost:5001/storage/materi_ajar/';
```

**Perbaikan:**
```tsx
// BENAR
const STORAGE_URL = 'http://localhost:5001/public/uploads/';
```

---

### AUDIT-01 — Inventaris Endpoint API

Berikut hasil audit lengkap semua endpoint yang digunakan FE vs yang tersedia di BE:

| Endpoint | FE menggunakannya | BE tersedia | Status |
|---|---|---|---|
| `GET /api/slider/` | ✓ Home.tsx | ✓ slider_routes | ✅ OK |
| `GET /api/profil-yayasan/` | ✓ Home.tsx | ✓ profil_yayasan_routes | ✅ OK |
| `GET /api/jenjang-pendidikan/` | ✓ Home.tsx, UnitLanding.tsx | ✓ jenjang_pendidikan_routes | ✅ OK |
| `GET /api/program-section/` | ✓ Home.tsx | ✓ program_section_routes | ✅ OK |
| `GET /api/program-unggulan/` | ✓ Home.tsx | ✓ program_unggulan_routes | ✅ OK |
| `GET /api/berita-artikel/` | ✓ Home.tsx, Berita.tsx | ✓ berita_artikel_routes | ✅ OK |
| `GET /api/penerimaan-siswa-baru/` | ✓ Home.tsx | ✓ penerimaan_siswa_baru_routes | ✅ OK |
| `GET /api/media-sosial/` | ✓ Home.tsx | ✓ media_sosial_routes | ✅ OK |
| `GET /api/hubungi_kami/` | ✓ HubungiKami.tsx | ✓ hubungi_kami_routes | ✅ OK |
| `GET /api/kolom_guru/` | ✓ KolomGuru.tsx | ✓ kolom_guru_routes | ✅ OK |
| `GET /api/kolom_siswa/` | ✓ KolomSiswa.tsx | ✓ kolom_siswa_routes | ✅ OK |
| `GET /api/kolom_alumni/` | ✓ KolomAlumni.tsx | ✓ kolom_alumni_routes | ✅ OK |
| `GET /api/majalah_digital/` | ✓ Majalah.tsx | ✓ majalah_digital_routes | ✅ OK |
| `POST /api/pendaftaran_siswa_baru/` | ✓ FormPendaftaran.tsx | ✓ pendaftaran_siswa_baru_routes | ✅ OK |
| `GET /api/fasilitas_section/` | ✓ Fasilitas.tsx | ✓ fasilitas_section_routes | ✅ OK |
| `GET /api/fasilitas_item/` | ✓ Fasilitas.tsx | ✓ fasilitas_item_routes | ✅ OK |
| `GET /api/program-kerja/` | ✓ ProgramKerja.tsx | ✓ profil_yayasan_program_kerja_routes | ✅ OK |
| `GET /api/banner_tkit/` | ✓ TKIT1.tsx | ✓ banner_tkit_routes | ✅ OK |
| `GET /api/banner_smkit/` | ✓ SMKIT.tsx | ✓ banner_smkit_routes | ✅ OK |
| `GET /api/banner_smait/` | ✓ SMAIT.tsx | ✓ banner_smait_routes | ✅ OK |
| `GET /api/banner_smpit/` | ✓ SMPIT.tsx | ✓ banner_smpit_routes | ✅ OK |
| `GET /api/banner_sdit/` | ✓ SDIT.tsx | ✓ banner_sdit_routes | ✅ OK |
| `GET /api/materi_ajar/` | ✓ Fitur.tsx | ✓ materi_ajar_routes | ✅ OK |
| `GET /api/profil_yayasan/sejarah/` | ✓ Sejarah.tsx | ✓ profil_yayasan_sejarah_routes | ✅ OK |
| `GET /api/profil_yayasan/struktur/` | ✓ StrukturOrganisasi.tsx | ✓ profil_yayasan_struktur_routes | ✅ OK |
| `GET /api/profil_yayasan/kemitraan/` | ✓ Kemitraan.tsx | ✓ profil_yayasan_kemitraan_routes | ✅ OK |
| `GET /api/komite-pomg/` | ✓ KeluargaFirdaus.tsx | ✓ komite_pomg_routes | ✅ OK |

---

### AUDIT-02 — CORS Configuration

**Status:** ✅ Tidak ada masalah

CORS dikonfigurasi di `backend/app/__init__.py`:
```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

Semua origin diizinkan untuk endpoint `/api/*`. Test verifikasi:
- Origin `http://localhost:3000` → `Access-Control-Allow-Origin: http://localhost:3000` ✓
- Origin `http://localhost:3001` → `Access-Control-Allow-Origin: http://localhost:3001` ✓

---

### AUDIT-03 — API Base URL dan Environment Variable

**Status:** ℹ️ Informasi penting

Semua API URL di frontend menggunakan konstanta `API_BASE_URL = 'http://localhost:5001'` yang didefinisikan di `frontend/constants.ts`.

**Pengecualian** (hardcoded, tidak menggunakan konstanta):
- `frontend/components/FormPendaftaran.tsx:85` — `'http://localhost:5001/api/pendaftaran_siswa_baru/'`
- `frontend/pages/unit/UnitLanding.tsx:5` — `'http://localhost:5001/api/jenjang-pendidikan/'`
- Beberapa halaman unit (TKIT1, SMAIT, SMPIT, dll.) mendefinisikan `API_BASE_URL` secara lokal

Ini tidak menyebabkan error saat development (semua masih `localhost:5001`), namun perlu diperhatikan saat migration ke production — nilai URL harus diubah di banyak tempat.

**Rekomendasi:** Sentralisasi semua API URL menggunakan import dari `frontend/constants.ts`.

---

### Catatan Penting untuk Deployment ke Production

Sebelum deploy, pastikan:

1. **`backend/.env`** diperbarui dengan kredensial database production (bukan `ardanau` yang merupakan user lokal macOS)
2. **Frontend `constants.ts`** — ubah `API_BASE_URL` dari `http://localhost:5001` ke URL production backend
3. **`frontend/index.html`** — update `canonical`, `og:url`, `og:image`, dan Schema.org `url`/`logo` dari `localhost` ke domain production
4. Backend berada di balik reverse proxy (nginx/Apache) — pastikan CORS di `app/__init__.py` diupdate ke domain spesifik (ganti `"*"` dengan domain FE yang sebenarnya)
