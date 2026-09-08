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
