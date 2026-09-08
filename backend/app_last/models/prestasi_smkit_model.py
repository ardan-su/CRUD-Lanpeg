from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smkit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(record_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smkit WHERE id = %s", (record_id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO prestasi_smkit (no, tahun_pelajaran, nama_kegiatan_lomba, juara)
        VALUES (%s, %s, %s, %s)
    """
    values = (
        data.get("no"),
        data.get("tahun_pelajaran"),
        data.get("nama_kegiatan_lomba"),
        data.get("juara"),
    )
    cursor.execute(sql, values)
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update(record_id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE prestasi_smkit
        SET no=%s, tahun_pelajaran=%s, nama_kegiatan_lomba=%s, juara=%s
        WHERE id=%s
    """
    values = (
        data.get("no"),
        data.get("tahun_pelajaran"),
        data.get("nama_kegiatan_lomba"),
        data.get("juara"),
        record_id,
    )
    cursor.execute(sql, values)
    db.commit()
    updated = cursor.rowcount
    cursor.close()
    return updated

def delete(record_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM prestasi_smkit WHERE id = %s", (record_id,))
    db.commit()
    deleted = cursor.rowcount
    cursor.close()
    return deleted
