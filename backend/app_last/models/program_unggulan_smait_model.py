from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_smait ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan_smait WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO program_unggulan_smait (nama_program, deskripsi)
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

def update(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE program_unggulan_smait
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

def delete(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM program_unggulan_smait WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
