from app.utils.db import get_db

# GET semua staf
def get_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM staf_smkit ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    return data

# GET staf by ID
def get_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM staf_smkit WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

# CREATE staf baru
def create(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO staf_smkit (nama, jabatan, image)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("nama"),
        data.get("jabatan"),
        data.get("image"),
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

# UPDATE staf
def update(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE staf_smkit
        SET nama=%s, jabatan=%s, image=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("nama"),
        data.get("jabatan"),
        data.get("image"),
        id,
    ))
    db.commit()
    cursor.close()
    return True

# DELETE staf
def delete(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM staf_smkit WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
