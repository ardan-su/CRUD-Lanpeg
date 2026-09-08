from app.utils.db import get_db

# Ambil semua majalah digital
def get_all_majalah_digital():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM majalah_digital ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

# Ambil majalah digital berdasarkan ID
def get_majalah_digital_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM majalah_digital WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

# Ambil majalah digital berdasarkan slug
def get_majalah_digital_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM majalah_digital WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

# Tambah majalah digital baru
def create_majalah_digital(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO majalah_digital (judul, slug, deskripsi, file_url, cover_image, status, tanggal_rilis, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('slug'),
        data.get('deskripsi'),
        data.get('file_url'),
        data.get('cover_image'),
        data.get('status', 'coming_soon'),
        data.get('tanggal_rilis'),
        data.get('meta_description'),
        data.get('content_delta')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

# Update majalah digital
def update_majalah_digital(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE majalah_digital
        SET judul=%s, slug=%s, deskripsi=%s, file_url=%s, cover_image=%s, status=%s, tanggal_rilis=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('slug'),
        data.get('deskripsi'),
        data.get('file_url'),
        data.get('cover_image'),
        data.get('status', 'coming_soon'),
        data.get('tanggal_rilis'),
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
    cursor.execute("UPDATE majalah_digital SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

# Hapus majalah digital
def delete_majalah_digital(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM majalah_digital WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
