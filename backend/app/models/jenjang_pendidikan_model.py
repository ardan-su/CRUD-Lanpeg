from app.utils.db import get_db

def get_all_jenjang():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jenjang_pendidikan ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_jenjang_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jenjang_pendidikan WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_jenjang(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO jenjang_pendidikan (judul, deskripsi, jenjang, nama_unit, image)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('jenjang'),
        data.get('nama_unit'),
        data.get('image')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_jenjang(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE jenjang_pendidikan
        SET judul=%s, deskripsi=%s, jenjang=%s, nama_unit=%s, image=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('jenjang'),
        data.get('nama_unit'),
        data.get('image'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_jenjang(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM jenjang_pendidikan WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
