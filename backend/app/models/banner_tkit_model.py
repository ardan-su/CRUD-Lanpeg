from app.utils.db import get_db

def get_all_banner():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM banner_tkit ORDER BY urutan ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_banner_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM banner_tkit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_banner(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO banner_tkit (judul, deskripsi, tombol_text, tombol_link, gambar, logo, urutan)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tombol_text'),
        data.get('tombol_link'),
        data.get('gambar'),
        data.get('logo'),
        data.get('urutan')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_banner(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE banner_tkit
        SET judul=%s, deskripsi=%s, tombol_text=%s, tombol_link=%s, 
            gambar=%s, logo=%s, urutan=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tombol_text'),
        data.get('tombol_link'),
        data.get('gambar'),
        data.get('logo'),
        data.get('urutan'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_banner(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM banner_tkit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
