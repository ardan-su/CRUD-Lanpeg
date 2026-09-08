from app.utils.db import get_db

def get_all_visi():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_visi ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_visi_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_visi WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_visi(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_visi (judul, deskripsi, visi)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("visi"),
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_visi(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_visi
        SET judul=%s, deskripsi=%s, visi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("visi"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_visi(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_visi WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
