from flask import Blueprint, request
from app.models import prestasi_smkit_model
from app.utils.response import success_response, error_response

prestasi_smkit_bp = Blueprint("prestasi_smkit", __name__)

# GET semua data
@prestasi_smkit_bp.route("/", methods=["GET"])
def get_all_prestasi():
    try:
        data = prestasi_smkit_model.get_all()
        return success_response(data, "Get all prestasi SMKIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@prestasi_smkit_bp.route("/<int:id>", methods=["GET"])
def get_prestasi_by_id(id):
    try:
        data = prestasi_smkit_model.get_by_id(id)
        if not data:
            return error_response("Prestasi not found", 404)
        return success_response(data, "Get prestasi success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@prestasi_smkit_bp.route("/", methods=["POST"])
def add_prestasi():
    try:
        payload = request.get_json()
        new_id = prestasi_smkit_model.create(payload)
        return success_response({"id": new_id}, "Prestasi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@prestasi_smkit_bp.route("/<int:id>", methods=["PUT"])
def edit_prestasi(id):
    try:
        payload = request.get_json()
        updated = prestasi_smkit_model.update(id, payload)
        if updated:
            return success_response({}, "Prestasi updated successfully")
        return error_response("Failed to update prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@prestasi_smkit_bp.route("/<int:id>", methods=["DELETE"])
def remove_prestasi(id):
    try:
        deleted = prestasi_smkit_model.delete(id)
        if deleted:
            return success_response({}, "Prestasi deleted successfully")
        return error_response("Failed to delete prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)
