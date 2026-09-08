from app.utils.db import get_db

def get_all_fasilitas_section():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM fasilitas_section ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_fasilitas_section_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM fasilitas_section WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_fasilitas_section(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO fasilitas_section (judul, deskripsi, fasilitas1, fasilitas2, fasilitas3, fasilitas4)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("fasilitas1"),
        data.get("fasilitas2"),
        data.get("fasilitas3"),
        data.get("fasilitas4")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_fasilitas_section(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE fasilitas_section
        SET judul=%s, deskripsi=%s, fasilitas1=%s, fasilitas2=%s, fasilitas3=%s, fasilitas4=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("deskripsi"),
        data.get("fasilitas1"),
        data.get("fasilitas2"),
        data.get("fasilitas3"),
        data.get("fasilitas4"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_fasilitas_section(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM fasilitas_section WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
