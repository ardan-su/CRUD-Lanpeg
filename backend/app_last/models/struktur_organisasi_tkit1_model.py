from app.utils.db import get_db

def get_all_struktur():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM struktur_organisasi_tkit1 ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_struktur_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM struktur_organisasi_tkit1 WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_struktur(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO struktur_organisasi_tkit1 (nama, jabatan, foto)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('foto')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_struktur(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE struktur_organisasi_tkit1
        SET nama=%s, jabatan=%s, foto=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('foto'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_struktur(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM struktur_organisasi_tkit1 WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
