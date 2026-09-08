from flask import Blueprint, request
from app.models import penerimaan_siswa_baru_model
from app.utils.response import success_response, error_response

bp = Blueprint("penerimaan_siswa_baru", __name__, url_prefix="/api/penerimaan-siswa-baru")

# GET semua data
@bp.route("/", methods=["GET"])
def get_all():
    try:
        data = penerimaan_siswa_baru_model.get_all_penerimaan()
        return success_response(data)
    except Exception as e:
        return error_response(str(e))

# GET by id
@bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    try:
        data = penerimaan_siswa_baru_model.get_penerimaan_by_id(id)
        if not data:
            return error_response("Data tidak ditemukan", 404)
        return success_response(data)
    except Exception as e:
        return error_response(str(e))

# CREATE
@bp.route("/", methods=["POST"])
def create():
    try:
        payload = request.json
        new_id = penerimaan_siswa_baru_model.create_penerimaan(payload)
        return success_response({"id": new_id}, "Data berhasil ditambahkan")
    except Exception as e:
        return error_response(str(e))

# UPDATE
@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    try:
        payload = request.json
        updated = penerimaan_siswa_baru_model.update_penerimaan(id, payload)
        if updated:
            return success_response({}, "Data berhasil diperbarui")
        return error_response("Gagal memperbarui data", 400)
    except Exception as e:
        return error_response(str(e))

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    try:
        deleted = penerimaan_siswa_baru_model.delete_penerimaan(id)
        if deleted:
            return success_response({}, "Data berhasil dihapus")
        return error_response("Gagal menghapus data", 400)
    except Exception as e:
        return error_response(str(e))
