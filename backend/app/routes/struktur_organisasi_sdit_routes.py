from flask import Blueprint, request
from app.models import struktur_organisasi_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("struktur_organisasi_sdit", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_struktur():
    try:
        data = struktur_organisasi_sdit_model.get_all_struktur()
        return success_response(data, "Get all struktur organisasi SDIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_struktur_by_id(id):
    try:
        data = struktur_organisasi_sdit_model.get_struktur_by_id(id)
        if not data:
            return error_response("Struktur organisasi not found", 404)
        return success_response(data, "Get struktur organisasi success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_struktur():
    try:
        data = request.get_json()
        new_id = struktur_organisasi_sdit_model.create_struktur(data)
        return success_response({"id": new_id}, "Struktur organisasi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_struktur(id):
    try:
        data = request.get_json()
        updated = struktur_organisasi_sdit_model.update_struktur(id, data)
        if updated:
            return success_response({}, "Struktur organisasi updated successfully")
        return error_response("Failed to update struktur organisasi", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_struktur(id):
    try:
        deleted = struktur_organisasi_sdit_model.delete_struktur(id)
        if deleted:
            return success_response({}, "Struktur organisasi deleted successfully")
        return error_response("Failed to delete struktur organisasi", 400)
    except Exception as e:
        return error_response(str(e), 500)
