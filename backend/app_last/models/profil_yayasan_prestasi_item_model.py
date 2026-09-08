from app.utils.db import get_db

def get_items_by_prestasi(prestasi_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM profil_yayasan_prestasi_item WHERE prestasi_id=%s ORDER BY id ASC",
        (prestasi_id,)
    )
    data = cursor.fetchall()
    cursor.close()
    return data

def get_item_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_prestasi_item WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_item(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_prestasi_item (prestasi_id, deskripsi, gambar)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("prestasi_id"),
        data.get("deskripsi"),
        data.get("gambar")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_item(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_prestasi_item
        SET prestasi_id=%s, deskripsi=%s, gambar=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("prestasi_id"),
        data.get("deskripsi"),
        data.get("gambar"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_item(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM profil_yayasan_prestasi_item WHERE id=%s", (id,))
    db.commit()
    cursor.close()
    return True
