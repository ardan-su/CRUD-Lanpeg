from app.utils.db import get_db

def get_all_program_unggulan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_program_unggulan ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_program_unggulan_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_program_unggulan WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_program_unggulan(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_program_unggulan (judul, deskripsi, ikon)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('ikon')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_program_unggulan(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_program_unggulan
        SET judul=%s, deskripsi=%s, ikon=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('ikon'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_program_unggulan(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_program_unggulan WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
