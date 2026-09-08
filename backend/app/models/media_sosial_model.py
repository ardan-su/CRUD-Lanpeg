from app.utils.db import get_db

def get_all_media():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM media_sosial ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_media_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM media_sosial WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_media(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO media_sosial (nama, username, icon, link)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('username'),
        data.get('icon'),
        data.get('link')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_media(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE media_sosial
        SET nama=%s, username=%s, icon=%s, link=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('nama'),
        data.get('username'),
        data.get('icon'),
        data.get('link'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_media(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM media_sosial WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
