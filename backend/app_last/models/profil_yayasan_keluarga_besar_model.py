from app.utils.db import get_db

def get_all_keluarga():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_keluarga_besar ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_keluarga_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_keluarga_besar WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_keluarga(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_keluarga_besar (judul, deskripsi, gambar)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("gambar")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_keluarga(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_keluarga_besar
        SET judul=%s, deskripsi=%s, gambar=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("gambar"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_keluarga(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_keluarga_besar WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
