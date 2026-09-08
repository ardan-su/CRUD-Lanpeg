from app.utils.db import get_db

def get_all_visi_misi_tujuan():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM visi_misi_tujuan_tkit_1 ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_visi_misi_tujuan_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM visi_misi_tujuan_tkit_1 WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_visi_misi_tujuan(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO visi_misi_tujuan_tkit_1 (visi, misi, tujuan)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('visi'),
        data.get('misi'),
        data.get('tujuan')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_visi_misi_tujuan(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE visi_misi_tujuan_tkit_1
        SET visi=%s, misi=%s, tujuan=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('visi'),
        data.get('misi'),
        data.get('tujuan'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_visi_misi_tujuan(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM visi_misi_tujuan_tkit_1 WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
