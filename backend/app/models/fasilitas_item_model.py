from app.utils.db import get_db

def get_all_fasilitas_item():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT fi.*, fs.judul AS section_judul 
        FROM fasilitas_item fi
        JOIN fasilitas_section fs ON fi.fasilitas_section_id = fs.id
        ORDER BY fi.id DESC
    """)
    data = cursor.fetchall()
    cursor.close()
    return data

def get_fasilitas_item_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT fi.*, fs.judul AS section_judul
        FROM fasilitas_item fi
        JOIN fasilitas_section fs ON fi.fasilitas_section_id = fs.id
        WHERE fi.id=%s
    """, (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_fasilitas_item(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO fasilitas_item (fasilitas_section_id, gambar)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get("fasilitas_section_id"),
        data.get("gambar")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_fasilitas_item(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE fasilitas_item
        SET fasilitas_section_id=%s, gambar=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("fasilitas_section_id"),
        data.get("gambar"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_fasilitas_item(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM fasilitas_item WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
