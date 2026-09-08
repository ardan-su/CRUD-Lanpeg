from flask import Blueprint, request
from app.models import staf_smait_model
from app.utils.response import success_response, error_response

bp = Blueprint("staf_smait", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_staf():
    try:
        data = staf_smait_model.get_all()
        return success_response(data, "Get all staf SMAIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_staf_by_id(id):
    try:
        data = staf_smait_model.get_by_id(id)
        if not data:
            return error_response("Staf not found", 404)
        return success_response(data, "Get staf success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_staf():
    try:
        data = request.get_json()
        new_id = staf_smait_model.create(data)
        return success_response({"id": new_id}, "Staf created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_staf(id):
    try:
        data = request.get_json()
        updated = staf_smait_model.update(id, data)
        if updated:
            return success_response({}, "Staf updated successfully")
        return error_response("Failed to update staf", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_staf(id):
    try:
        deleted = staf_smait_model.delete(id)
        if deleted:
            return success_response({}, "Staf deleted successfully")
        return error_response("Failed to delete staf", 400)
    except Exception as e:
        return error_response(str(e), 500)
