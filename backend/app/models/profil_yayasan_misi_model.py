from app.utils.db import get_db

def get_all_misi():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_misi ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_misi_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_misi WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_misi(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_misi (profil_id, nomor, isi)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("profil_id"),
        data.get("nomor"),
        data.get("isi"),
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_misi(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_misi
        SET profil_id=%s, nomor=%s, isi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("profil_id"),
        data.get("nomor"),
        data.get("isi"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_misi(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_misi WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
