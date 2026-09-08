from app.utils.db import get_db

def get_all_kolom_alumni():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_alumni ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_kolom_alumni_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_alumni WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_kolom_alumni_by_slug(slug):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kolom_alumni WHERE slug = %s", (slug,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_kolom_alumni(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO kolom_alumni (judul, slug, status, isi, nama_alumni, angkatan, gambar, meta_description, content_delta)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("isi"),
        data.get("nama_alumni"),
        data.get("angkatan"),
        data.get("gambar"),
        data.get("meta_description"),
        data.get("content_delta")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_kolom_alumni(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE kolom_alumni
        SET judul=%s, slug=%s, status=%s, isi=%s, nama_alumni=%s, angkatan=%s, gambar=%s, meta_description=%s, content_delta=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("slug"),
        data.get("status", "published"),
        data.get("isi"),
        data.get("nama_alumni"),
        data.get("angkatan"),
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
    cursor.execute("UPDATE kolom_alumni SET views = views + 1 WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    return True

def delete_kolom_alumni(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM kolom_alumni WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
