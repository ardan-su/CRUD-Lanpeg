from app.utils.db import get_db

def get_all_contact():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contact ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_contact_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contact WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_contact(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO contact (judul, alamat, telepon, email)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("alamat"),
        data.get("telepon"),
        data.get("email")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_contact(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE contact
        SET judul=%s, alamat=%s, telepon=%s, email=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("judul"),
        data.get("alamat"),
        data.get("telepon"),
        data.get("email"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_contact(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM contact WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
