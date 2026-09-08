from app.utils.db import get_db

def get_all_sliders():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM slider ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_slider_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM slider WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_slider(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO slider (judul, deskripsi, tombol_text, gambar)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tombol_text'),
        data.get('gambar')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_slider(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE slider
        SET judul=%s, deskripsi=%s, tombol_text=%s, gambar=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tombol_text'),
        data.get('gambar'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_slider(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM slider WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
