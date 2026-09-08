from app.utils.db import get_db

def get_all_programs():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_program_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def get_programs_by_section(section_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_unggulan WHERE section_id=%s ORDER BY id ASC", (section_id,))
    data = cursor.fetchall()
    cursor.close()
    return data

def create_program(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO program_unggulan (section_id, deskripsi, image)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('section_id'),
        data.get('deskripsi'),
        data.get('image')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_program(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE program_unggulan
        SET section_id=%s, deskripsi=%s, image=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('section_id'),
        data.get('deskripsi'),
        data.get('image'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_program(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM program_unggulan WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
