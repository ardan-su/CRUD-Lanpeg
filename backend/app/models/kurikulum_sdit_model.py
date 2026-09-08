from app.utils.db import get_db

def get_all_kurikulum():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kurikulum_sdit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_kurikulum_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kurikulum_sdit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_kurikulum(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO kurikulum_sdit (judul, deskripsi)
        VALUES (%s, %s)
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi')
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_kurikulum(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE kurikulum_sdit
        SET judul=%s, deskripsi=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get('judul'),
        data.get('deskripsi'),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_kurikulum(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM kurikulum_sdit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
