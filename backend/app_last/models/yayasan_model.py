from app.utils.db import get_db

def get_all_yayasan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM yayasan ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_yayasan_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM yayasan WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_yayasan(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO yayasan (judul, deskripsi, tahun_didirikan, pendiri, ketua, link_selengkapnya)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tahun_didirikan'),
        data.get('pendiri'),
        data.get('ketua'),
        data.get('link_selengkapnya')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_yayasan(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE yayasan
        SET judul=%s, deskripsi=%s, tahun_didirikan=%s, pendiri=%s, ketua=%s, link_selengkapnya=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('tahun_didirikan'),
        data.get('pendiri'),
        data.get('ketua'),
        data.get('link_selengkapnya'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_yayasan(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM yayasan WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True