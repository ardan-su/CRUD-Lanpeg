from app.utils.db import get_db

def get_all_kolom_siswa():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_siswa ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_kolom_siswa_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_siswa WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_kolom_siswa_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_siswa WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_kolom_siswa(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO kolom_siswa (judul, slug, status, nama_siswa, kategori, angkatan, tahun_ajaran, kelas, konten, gambar, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("nama_siswa"),
        data.get("kategori"),
        data.get("angkatan"),
        data.get("tahun_ajaran"),
        data.get("kelas"),
        data.get("konten"),
        data.get("gambar"),
        data.get("meta_description"),
        data.get("content_delta")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_kolom_siswa(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE kolom_siswa
        SET judul=%s, slug=%s, status=%s, nama_siswa=%s, kategori=%s, angkatan=%s, tahun_ajaran=%s, kelas=%s, konten=%s, gambar=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("nama_siswa"),
        data.get("kategori"),
        data.get("angkatan"),
        data.get("tahun_ajaran"),
        data.get("kelas"),
        data.get("konten"),
        data.get("gambar"),
        data.get("meta_description"),
        data.get("content_delta"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def increment_views(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE kolom_siswa SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

def delete_kolom_siswa(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM kolom_siswa WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
