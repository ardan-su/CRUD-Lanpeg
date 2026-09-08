from app.utils.db import get_db

def get_all_program():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_tkit_2 ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_program_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_tkit_2 WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_program(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO program_unggulan_tkit_2 (nama_program, deskripsi)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get('nama_program'),
        data.get('deskripsi')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_program(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE program_unggulan_tkit_2
        SET nama_program=%s, deskripsi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama_program'),
        data.get('deskripsi'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_program(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM program_unggulan_tkit_2 WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
