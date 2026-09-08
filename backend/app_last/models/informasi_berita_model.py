from app.utils.db import get_db

def get_all_informasi_berita():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM informasi_berita ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_informasi_berita_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM informasi_berita WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_informasi_berita_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM informasi_berita WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_informasi_berita(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO informasi_berita (kategori, judul, slug, status, deskripsi, tanggal, image_url, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('kategori'),
        data.get('judul'),
        data.get('slug'),
        data.get('status', 'published'),
        data.get('deskripsi'),
        data.get('tanggal'),
        data.get('image_url'),
        data.get('meta_description'),
        data.get('content_delta')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_informasi_berita(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE informasi_berita
        SET kategori=%s, judul=%s, slug=%s, status=%s, deskripsi=%s, tanggal=%s, image_url=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('kategori'),
        data.get('judul'),
        data.get('slug'),
        data.get('status', 'published'),
        data.get('deskripsi'),
        data.get('tanggal'),
        data.get('image_url'),
        data.get('meta_description'),
        data.get('content_delta'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def increment_views(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE informasi_berita SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

def delete_informasi_berita(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM informasi_berita WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
