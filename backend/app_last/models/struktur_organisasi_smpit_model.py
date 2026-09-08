from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM struktur_organisasi_smpit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM struktur_organisasi_smpit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO struktur_organisasi_smpit (nama, jabatan, image, created_at, updated_at)
        VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('image')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE struktur_organisasi_smpit
        SET nama=%s, jabatan=%s, image=%s, updated_at=CURRENT_TIMESTAMP
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('image'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM struktur_organisasi_smpit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
