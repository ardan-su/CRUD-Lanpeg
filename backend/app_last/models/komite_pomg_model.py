from app.utils.db import get_db

def get_all_komite():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM komite_pomg ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_komite_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM komite_pomg WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_komite(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO komite_pomg (nama, jabatan, unit, foto)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('unit'),
        data.get('foto')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_komite(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE komite_pomg
        SET nama=%s, jabatan=%s, unit=%s, foto=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('jabatan'),
        data.get('unit'),
        data.get('foto'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_komite(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM komite_pomg WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
