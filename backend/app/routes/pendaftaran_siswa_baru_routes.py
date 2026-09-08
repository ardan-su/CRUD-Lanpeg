from flask import Blueprint, request
from app.models import pendaftaran_siswa_baru_model
from app.utils.response import success_response, error_response

bp = Blueprint("pendaftaran_siswa_baru", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_pendaftaran():
    try:
        data = pendaftaran_siswa_baru_model.get_all_pendaftaran()
        return success_response(data, "Get all pendaftaran siswa baru success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_pendaftaran_by_id(id):
    try:
        data = pendaftaran_siswa_baru_model.get_pendaftaran_by_id(id)
        if not data:
            return error_response("Pendaftaran not found", 404)
        return success_response(data, "Get pendaftaran siswa baru success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def create_pendaftaran():
    try:
        data = request.get_json()
        
        required_fields = [
            "nik", "nisn", "tempat_lahir", "tanggal_lahir", "alamat_lengkap",
            "nama_calon_siswa", "asal_sekolah", "alamat_asal_sekolah",
            "unit_pilihan", "nama_orang_tua_wali", "no_wa", "tahun_pelajaran"
        ]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return error_response(f"Missing fields: {', '.join(missing_fields)}", 400)

        new_id = pendaftaran_siswa_baru_model.create_pendaftaran(data)
        return success_response({"id": new_id}, "Pendaftaran siswa baru created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def update_pendaftaran(id):
    try:
        data = request.get_json()
        
        required_fields = [
            "nik", "nisn", "tempat_lahir", "tanggal_lahir", "alamat_lengkap",
            "nama_calon_siswa", "asal_sekolah", "alamat_asal_sekolah",
            "unit_pilihan", "nama_orang_tua_wali", "no_wa", "tahun_pelajaran"
        ]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return error_response(f"Missing fields: {', '.join(missing_fields)}", 400)

        updated = pendaftaran_siswa_baru_model.update_pendaftaran(id, data)
        if updated:
            return success_response({}, "Pendaftaran siswa baru updated successfully")
        return error_response("Failed to update pendaftaran", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def delete_pendaftaran(id):
    try:
        deleted = pendaftaran_siswa_baru_model.delete_pendaftaran(id)
        if deleted:
            return success_response({}, "Pendaftaran siswa baru deleted successfully")
        return error_response("Failed to delete pendaftaran", 400)
    except Exception as e:
        return error_response(str(e), 500)
