from app.utils.db import get_db

def get_all_prestasi():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_sdit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_prestasi_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_sdit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_prestasi(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO prestasi_sdit (tanggal, nama_siswa, jenis_lomba, prestasi, tingkat, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
    """
    cursor.execute(sql, (
        data.get('tanggal'),
        data.get('nama_siswa'),
        data.get('jenis_lomba'),
        data.get('prestasi'),
        data.get('tingkat')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_prestasi(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE prestasi_sdit
        SET tanggal=%s, nama_siswa=%s, jenis_lomba=%s, prestasi=%s, tingkat=%s, updated_at=NOW()
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('tanggal'),
        data.get('nama_siswa'),
        data.get('jenis_lomba'),
        data.get('prestasi'),
        data.get('tingkat'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_prestasi(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM prestasi_sdit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
