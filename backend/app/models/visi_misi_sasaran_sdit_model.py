from app.utils.db import get_db

def get_all_visi_misi_sasaran():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM visi_misi_sasaran_sdit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_visi_misi_sasaran_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM visi_misi_sasaran_sdit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_visi_misi_sasaran(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO visi_misi_sasaran_sdit (tipe, deskripsi)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get('tipe'),
        data.get('deskripsi')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_visi_misi_sasaran(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE visi_misi_sasaran_sdit
        SET tipe=%s, deskripsi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('tipe'),
        data.get('deskripsi'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_visi_misi_sasaran(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM visi_misi_sasaran_sdit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
