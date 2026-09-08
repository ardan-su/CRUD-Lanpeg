from app.utils.db import get_db

def get_all_program():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_sdit ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_program_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_sdit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_program(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO program_unggulan_sdit (kategori, nama_program)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get('kategori'),
        data.get('nama_program')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_program(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE program_unggulan_sdit
        SET kategori=%s, nama_program=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('kategori'),
        data.get('nama_program'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_program(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM program_unggulan_sdit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
