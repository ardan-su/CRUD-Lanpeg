from flask import Blueprint, request
from app.models import prestasi_smpit_model
from app.utils.response import success_response, error_response

bp = Blueprint("prestasi_smpit", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_prestasi():
    try:
        data = prestasi_smpit_model.get_all()
        return success_response(data, "Get all prestasi SMPIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:no>", methods=["GET"])
def get_prestasi_by_id(no):
    try:
        data = prestasi_smpit_model.get_by_id(no)
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
        new_id = prestasi_smpit_model.create(data)
        return success_response({"no": new_id}, "Prestasi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:no>", methods=["PUT"])
def edit_prestasi(no):
    try:
        data = request.get_json()
        updated = prestasi_smpit_model.update(no, data)
        if updated:
            return success_response({}, "Prestasi updated successfully")
        return error_response("Failed to update prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:no>", methods=["DELETE"])
def remove_prestasi(no):
    try:
        deleted = prestasi_smpit_model.delete(no)
        if deleted:
            return success_response({}, "Prestasi deleted successfully")
        return error_response("Failed to delete prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)
