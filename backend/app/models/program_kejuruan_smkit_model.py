from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_kejuruan_smkit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(record_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM program_kejuruan_smkit WHERE id = %s", (record_id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO program_kejuruan_smkit (kategori, deskripsi) VALUES (%s, %s)",
        (data['kategori'], data.get('deskripsi'))
    )
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update(record_id, data):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE program_kejuruan_smkit SET kategori=%s, deskripsi=%s WHERE id=%s",
        (data['kategori'], data.get('deskripsi'), record_id)
    )
    db.commit()
    cursor.close()
    return True

def delete(record_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM program_kejuruan_smkit WHERE id=%s", (record_id,))
    db.commit()
    cursor.close()
    return True
