from app.utils.db import get_db

def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smpit ORDER BY no DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_by_id(no):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM prestasi_smpit WHERE no=%s", (no,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO prestasi_smpit (jenis_lomba, hasil_lomba, penyelenggara, lingkup, tahun)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('jenis_lomba'),
        data.get('hasil_lomba'),
        data.get('penyelenggara'),
        data.get('lingkup'),
        data.get('tahun')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update(no, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE prestasi_smpit
        SET jenis_lomba=%s, hasil_lomba=%s, penyelenggara=%s, lingkup=%s, tahun=%s
        WHERE no=%s
    """
    cursor.execute(sql, (
        data.get('jenis_lomba'),
        data.get('hasil_lomba'),
        data.get('penyelenggara'),
        data.get('lingkup'),
        data.get('tahun'),
        no
    ))
    db.commit()
    cursor.close()
    return True

def delete(no):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM prestasi_smpit WHERE no=%s"
    cursor.execute(sql, (no,))
    db.commit()
    cursor.close()
    return True
