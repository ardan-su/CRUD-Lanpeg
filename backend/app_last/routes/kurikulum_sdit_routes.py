from flask import Blueprint, request
from app.models import kurikulum_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("kurikulum_sdit", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_kurikulum():
    try:
        data = kurikulum_sdit_model.get_all_kurikulum()
        return success_response(data, "Get all kurikulum success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_kurikulum_by_id(id):
    try:
        data = kurikulum_sdit_model.get_kurikulum_by_id(id)
        if not data:
            return error_response("Kurikulum not found", 404)
        return success_response(data, "Get kurikulum success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_kurikulum():
    try:
        data = request.get_json()
        new_id = kurikulum_sdit_model.create_kurikulum(data)
        return success_response({"id": new_id}, "Kurikulum created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_kurikulum(id):
    try:
        data = request.get_json()
        updated = kurikulum_sdit_model.update_kurikulum(id, data)
        if updated:
            return success_response({}, "Kurikulum updated successfully")
        return error_response("Failed to update kurikulum", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_kurikulum(id):
    try:
        deleted = kurikulum_sdit_model.delete_kurikulum(id)
        if deleted:
            return success_response({}, "Kurikulum deleted successfully")
        return error_response("Failed to delete kurikulum", 400)
    except Exception as e:
        return error_response(str(e), 500)
