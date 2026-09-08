from app.utils.db import get_db

def get_all_penerimaan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM penerimaan_siswa_baru ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_penerimaan_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM penerimaan_siswa_baru WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_penerimaan(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO penerimaan_siswa_baru 
        (judul, subjudul, sapaan, deskripsi, teks_tombol, link_tombol)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('subjudul'),
        data.get('sapaan'),
        data.get('deskripsi'),
        data.get('teks_tombol'),
        data.get('link_tombol')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_penerimaan(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE penerimaan_siswa_baru
        SET judul=%s, subjudul=%s, sapaan=%s, deskripsi=%s, teks_tombol=%s, link_tombol=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('subjudul'),
        data.get('sapaan'),
        data.get('deskripsi'),
        data.get('teks_tombol'),
        data.get('link_tombol'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_penerimaan(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM penerimaan_siswa_baru WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
