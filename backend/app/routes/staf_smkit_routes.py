from flask import Blueprint, request
from app.models import staf_smkit_model
from app.utils.response import success_response, error_response

bp = Blueprint("staf_smkit", __name__)

# GET semua staf
@bp.route("/", methods=["GET"])
def get_all_staf():
    try:
        data = staf_smkit_model.get_all()
        return success_response(data, "Get all staf SMKIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET staf by ID
@bp.route("/<int:id>", methods=["GET"])
def get_staf_by_id(id):
    try:
        data = staf_smkit_model.get_by_id(id)
        if not data:
            return error_response("Staf not found", 404)
        return success_response(data, "Get staf success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah staf
@bp.route("/", methods=["POST"])
def add_staf():
    try:
        data = request.get_json()
        new_id = staf_smkit_model.create(data)
        return success_response({"id": new_id}, "Staf created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update staf
@bp.route("/<int:id>", methods=["PUT"])
def edit_staf(id):
    try:
        data = request.get_json()
        updated = staf_smkit_model.update(id, data)
        if updated:
            return success_response({}, "Staf updated successfully")
        return error_response("Failed to update staf", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE staf
@bp.route("/<int:id>", methods=["DELETE"])
def remove_staf(id):
    try:
        deleted = staf_smkit_model.delete(id)
        if deleted:
            return success_response({}, "Staf deleted successfully")
        return error_response("Failed to delete staf", 400)
    except Exception as e:
        return error_response(str(e), 500)
