from app.utils.db import get_db

def get_all_sejarah():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_sejarah ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_sejarah_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_sejarah WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_sejarah(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_sejarah (judul, deskripsi)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_sejarah(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_sejarah
        SET judul=%s, deskripsi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_sejarah(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_sejarah WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
