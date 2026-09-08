from app.utils.db import get_db

def get_all_berita():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM berita_artikel ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_berita_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM berita_artikel WHERE id = %s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_berita_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM berita_artikel WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_berita(data):
    db = get_db()
    cursor = db.cursor()
    query = """
        INSERT INTO berita_artikel (kategori, judul, slug, status, gambar, tanggal, deskripsi, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        data.get("kategori"),
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("gambar"),
        data.get("tanggal"),
        data.get("deskripsi"),
        data.get("meta_description"),
        data.get("content_delta"),
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_berita(id, data):
    db = get_db()
    cursor = db.cursor()
    query = """
        UPDATE berita_artikel
        SET kategori=%s, judul=%s, slug=%s, status=%s, gambar=%s, tanggal=%s, deskripsi=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(query, (
        data.get("kategori"),
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("gambar"),
        data.get("tanggal"),
        data.get("deskripsi"),
        data.get("meta_description"),
        data.get("content_delta"),
        id
    ))
    db.commit()
    updated = cursor.rowcount
    cursor.close()
    return updated > 0

def increment_views(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE berita_artikel SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

def delete_berita(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM berita_artikel WHERE id = %s", (id,))
    db.commit()
    deleted = cursor.rowcount
    cursor.close()
    return deleted > 0
