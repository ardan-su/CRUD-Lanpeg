from app.utils.db import get_db

def get_all_banner():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM banner_dkv ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_banner_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM banner_dkv WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_banner(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO banner_dkv (judul, deskripsi, gambar, tombol_teks, tombol_link)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('gambar'),
        data.get('tombol_teks'),
        data.get('tombol_link')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_banner(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE banner_dkv
        SET judul=%s, deskripsi=%s, gambar=%s, tombol_teks=%s, tombol_link=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('gambar'),
        data.get('tombol_teks'),
        data.get('tombol_link'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_banner(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM banner_dkv WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
