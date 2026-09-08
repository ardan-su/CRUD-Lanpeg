from app.utils.db import get_db

def get_all_profil():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_profil_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profil_yayasan WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_profil(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO profil_yayasan (judul, deskripsi, subjudul, sambutan, nama_ketua, jabatan, foto_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('subjudul'),
        data.get('sambutan'),
        data.get('nama_ketua'),
        data.get('jabatan'),
        data.get('foto_url')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_profil(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE profil_yayasan
        SET judul=%s, deskripsi=%s, subjudul=%s, sambutan=%s,
            nama_ketua=%s, jabatan=%s, foto_url=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        data.get('subjudul'),
        data.get('sambutan'),
        data.get('nama_ketua'),
        data.get('jabatan'),
        data.get('foto_url'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_profil(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM profil_yayasan WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
