from app.utils.db import get_db

def get_items_by_kemitraan(kemitraan_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM profil_yayasan_kemitraan_item WHERE kemitraan_id=%s ORDER BY id ASC",
        (kemitraan_id,)
    )
    data = cursor.fetchall()
    cursor.close()
    return data

def get_item_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_kemitraan_item WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_item(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_kemitraan_item (kemitraan_id, nama, icon)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("kemitraan_id"),
        data.get("nama"),
        data.get("icon")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_item(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_kemitraan_item
        SET nama=%s, icon=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("nama"),
        data.get("icon"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_item(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_kemitraan_item WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
