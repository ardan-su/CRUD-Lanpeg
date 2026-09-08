from app.utils.db import get_db

def get_all_prestasi():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_prestasi ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_prestasi_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_prestasi WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_prestasi(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_prestasi (bidang, keterangan)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get("bidang"),
        data.get("keterangan")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_prestasi(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_prestasi
        SET bidang=%s, keterangan=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("bidang"),
        data.get("keterangan"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_prestasi(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_prestasi WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
