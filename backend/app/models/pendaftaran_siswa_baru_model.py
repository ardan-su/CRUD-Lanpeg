from app.utils.db import get_db

def get_all_pendaftaran():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pendaftaran_siswa_baru ORDER BY id ASC")
    data = cursor.fetchall()
    cursor.close()
    return data

def get_pendaftaran_by_id(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pendaftaran_siswa_baru WHERE id=%s", (id,))
    data = cursor.fetchone()
    cursor.close()
    return data

def create_pendaftaran(data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        INSERT INTO pendaftaran_siswa_baru 
        (nik, nisn, tempat_lahir, tanggal_lahir, alamat_lengkap,
         nama_calon_siswa, asal_sekolah, alamat_asal_sekolah,
         unit_pilihan, nama_orang_tua_wali, no_wa, tahun_pelajaran)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data.get("nik"),
        data.get("nisn"),
        data.get("tempat_lahir"),
        data.get("tanggal_lahir"),
        data.get("alamat_lengkap"),
        data.get("nama_calon_siswa"),
        data.get("asal_sekolah"),
        data.get("alamat_asal_sekolah"),
        data.get("unit_pilihan"),
        data.get("nama_orang_tua_wali"),
        data.get("no_wa"),
        data.get("tahun_pelajaran")
    ))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

def update_pendaftaran(id, data):
    db = get_db()
    cursor = db.cursor()
    sql = """
        UPDATE pendaftaran_siswa_baru
        SET nik=%s, nisn=%s, tempat_lahir=%s, tanggal_lahir=%s, alamat_lengkap=%s,
            nama_calon_siswa=%s, asal_sekolah=%s, alamat_asal_sekolah=%s,
            unit_pilihan=%s, nama_orang_tua_wali=%s, no_wa=%s, tahun_pelajaran=%s
        WHERE id=%s
    """
    cursor.execute(sql, (
        data.get("nik"),
        data.get("nisn"),
        data.get("tempat_lahir"),
        data.get("tanggal_lahir"),
        data.get("alamat_lengkap"),
        data.get("nama_calon_siswa"),
        data.get("asal_sekolah"),
        data.get("alamat_asal_sekolah"),
        data.get("unit_pilihan"),
        data.get("nama_orang_tua_wali"),
        data.get("no_wa"),
        data.get("tahun_pelajaran"),
        id
    ))
    db.commit()
    cursor.close()
    return True

def delete_pendaftaran(id):
    db = get_db()
    cursor = db.cursor()
    sql = "DELETE FROM pendaftaran_siswa_baru WHERE id=%s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    return True
