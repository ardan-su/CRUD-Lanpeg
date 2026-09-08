from app.utils.db import get_db

def get_all_materi():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM materi_ajar ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_materi_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM materi_ajar WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_materi(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO materi_ajar 
        (judul, deskripsi, gambar, penulis, tanggal, tombol_teks, tombol_link) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('gambar'),
        data.get('penulis'),
        data.get('tanggal'),
        data.get('tombol_teks'),
        data.get('tombol_link')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_materi(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE materi_ajar
        SET judul=%s, deskripsi=%s, gambar=%s, penulis=%s, 
            tanggal=%s, tombol_teks=%s, tombol_link=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('gambar'),
        data.get('penulis'),
        data.get('tanggal'),
        data.get('tombol_teks'),
        data.get('tombol_link'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_materi(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM materi_ajar WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
