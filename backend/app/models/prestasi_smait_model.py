from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smait ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smait WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO prestasi_smait (no, tgl, nama, event, penyelenggara, level, peringkat, score)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('no'),
        data.get('tgl'),
        data.get('nama'),
        data.get('event'),
        data.get('penyelenggara'),
        data.get('level'),
        data.get('peringkat'),
        data.get('score')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE prestasi_smait
        SET no=%s, tgl=%s, nama=%s, event=%s, penyelenggara=%s, level=%s, peringkat=%s, score=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('no'),
        data.get('tgl'),
        data.get('nama'),
        data.get('event'),
        data.get('penyelenggara'),
        data.get('level'),
        data.get('peringkat'),
        data.get('score'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM prestasi_smait WHERE id=%s", (id,))
    db.commit()
    cursor.close()
    return True
