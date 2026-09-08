from app.utils.db import get_db

def get_all_kegiatan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kegiatan_pembelajaran_tkit2 ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_kegiatan_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kegiatan_pembelajaran_tkit2 WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_kegiatan(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO kegiatan_pembelajaran_tkit2 (judul, deskripsi, kelompok)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('kelompok')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_kegiatan(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE kegiatan_pembelajaran_tkit2
        SET judul=%s, deskripsi=%s, kelompok=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('kelompok'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_kegiatan(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM kegiatan_pembelajaran_tkit2 WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
