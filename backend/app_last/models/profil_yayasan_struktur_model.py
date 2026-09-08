from app.utils.db import get_db

def get_all_struktur():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_struktur ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_struktur_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_struktur WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_struktur(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_struktur (nama, jabatan, gambar, keterangan)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("nama"),
        data.get("jabatan"),
        data.get("gambar"),
        data.get("keterangan")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_struktur(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_struktur
        SET nama=%s, jabatan=%s, gambar=%s, keterangan=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("nama"),
        data.get("jabatan"),
        data.get("gambar"),
        data.get("keterangan"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_struktur(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_struktur WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
