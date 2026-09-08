from app.utils.db import get_db

def get_all_hubungi_kami():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM hubungi_kami ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_hubungi_kami_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM hubungi_kami WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_hubungi_kami(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO hubungi_kami (nama_unit, alamat, telepon, email, map_url)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('nama_unit'),
        data.get('alamat'),
        data.get('telepon'),
        data.get('email'),
        data.get('map_url')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_hubungi_kami(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE hubungi_kami
        SET nama_unit=%s, alamat=%s, telepon=%s, email=%s, map_url=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama_unit'),
        data.get('alamat'),
        data.get('telepon'),
        data.get('email'),
        data.get('map_url'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_hubungi_kami(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM hubungi_kami WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
