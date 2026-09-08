from app.utils.db import get_db

def get_all_sections():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_section ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_section_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_section WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_section(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO program_section (judul, deskripsi)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_section(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE program_section
        SET judul=%s, deskripsi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_section(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM program_section WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
