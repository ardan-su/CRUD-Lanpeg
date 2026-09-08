from flask import Blueprint, request
from app.models import kegiatan_pembelajaran_tkit2_model
from app.utils.response import success_response, error_response

bp = Blueprint("kegiatan_pembelajaran_tkit2", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_kegiatan():
    try:
        data = kegiatan_pembelajaran_tkit2_model.get_all_kegiatan()
        return success_response(data, "Get all kegiatan pembelajaran success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_kegiatan_by_id(id):
    try:
        data = kegiatan_pembelajaran_tkit2_model.get_kegiatan_by_id(id)
        if not data:
            return error_response("Kegiatan pembelajaran not found", 404)
        return success_response(data, "Get kegiatan pembelajaran success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_kegiatan():
    try:
        data = request.get_json()
        new_id = kegiatan_pembelajaran_tkit2_model.create_kegiatan(data)
        return success_response({"id": new_id}, "Kegiatan pembelajaran created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_kegiatan(id):
    try:
        data = request.get_json()
        updated = kegiatan_pembelajaran_tkit2_model.update_kegiatan(id, data)
        if updated:
            return success_response({}, "Kegiatan pembelajaran updated successfully")
        return error_response("Failed to update kegiatan pembelajaran", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_kegiatan(id):
    try:
        deleted = kegiatan_pembelajaran_tkit2_model.delete_kegiatan(id)
        if deleted:
            return success_response({}, "Kegiatan pembelajaran deleted successfully")
        return error_response("Failed to delete kegiatan pembelajaran", 400)
    except Exception as e:
        return error_response(str(e), 500)
