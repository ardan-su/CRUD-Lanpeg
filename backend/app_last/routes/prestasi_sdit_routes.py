from flask import Blueprint, request
from app.models import prestasi_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("prestasi_sdit", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_prestasi():
    try:
        data = prestasi_sdit_model.get_all_prestasi()
        return success_response(data, "Get all prestasi SDIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_prestasi_by_id(id):
    try:
        data = prestasi_sdit_model.get_prestasi_by_id(id)
        if not data:
            return error_response("Prestasi not found", 404)
        return success_response(data, "Get prestasi success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_prestasi():
    try:
        data = request.get_json()
        new_id = prestasi_sdit_model.create_prestasi(data)
        return success_response({"id": new_id}, "Prestasi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_prestasi(id):
    try:
        data = request.get_json()
        updated = prestasi_sdit_model.update_prestasi(id, data)
        if updated:
            return success_response({}, "Prestasi updated successfully")
        return error_response("Failed to update prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_prestasi(id):
    try:
        deleted = prestasi_sdit_model.delete_prestasi(id)
        if deleted:
            return success_response({}, "Prestasi deleted successfully")
        return error_response("Failed to delete prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)
