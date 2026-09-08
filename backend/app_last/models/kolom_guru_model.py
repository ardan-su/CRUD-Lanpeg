from app.utils.db import get_db

def get_all_kolom():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_guru ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_kolom_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_guru WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_kolom_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_guru WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_kolom(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO kolom_guru (judul, slug, detail_link, konten, penulis, tanggal, status, image, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('slug'),
        data.get('detail_link'),
        data.get('konten'),
        data.get('penulis'),
        data.get('tanggal'),
        data.get('status', 'draft'),
        data.get('image'),
        data.get('meta_description'),
        data.get('content_delta')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_kolom(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE kolom_guru
        SET judul=%s, slug=%s, detail_link=%s, konten=%s, penulis=%s, tanggal=%s, status=%s, image=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('slug'),
        data.get('detail_link'),
        data.get('konten'),
        data.get('penulis'),
        data.get('tanggal'),
        data.get('status', 'draft'),
        data.get('image'),
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
    cursor.execute("UPDATE kolom_guru SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

def delete_kolom(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM kolom_guru WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
