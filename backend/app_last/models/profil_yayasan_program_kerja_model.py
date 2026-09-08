from app.utils.db import get_db

def get_all_program_kerja():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_program_kerja ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_program_kerja_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan_program_kerja WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_program_kerja(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan_program_kerja (judul, deskripsi, image, created_at, updated_at)
        VALUES (%s, %s, %s, NOW(), NOW())
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('image')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_program_kerja(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan_program_kerja
        SET judul=%s, deskripsi=%s, image=%s, updated_at=NOW()
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('image'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_program_kerja(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan_program_kerja WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
