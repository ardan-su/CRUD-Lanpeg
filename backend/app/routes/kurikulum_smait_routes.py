from flask import Blueprint, request
from app.models import kurikulum_smait_model
from app.utils.response import success_response, error_response

bp = Blueprint("kurikulum_smait", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_kurikulum():
    try:
        data = kurikulum_smait_model.get_all()
        return success_response(data, "Get all kurikulum SMAIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_kurikulum_by_id(id):
    try:
        data = kurikulum_smait_model.get_by_id(id)
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
        new_id = kurikulum_smait_model.create(data)
        return success_response({"id": new_id}, "Kurikulum created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_kurikulum(id):
    try:
        data = request.get_json()
        updated = kurikulum_smait_model.update(id, data)
        if updated:
            return success_response({}, "Kurikulum updated successfully")
        return error_response("Failed to update kurikulum", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_kurikulum(id):
    try:
        deleted = kurikulum_smait_model.delete(id)
        if deleted:
            return success_response({}, "Kurikulum deleted successfully")
        return error_response("Failed to delete kurikulum", 400)
    except Exception as e:
        return error_response(str(e), 500)
