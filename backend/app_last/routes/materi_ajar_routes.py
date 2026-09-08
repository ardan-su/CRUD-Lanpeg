from flask import Blueprint, request
from app.models import materi_ajar_model
from app.utils.response import success_response, error_response

bp = Blueprint("materi_ajar", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_materi():
    try:
        data = materi_ajar_model.get_all_materi()
        return success_response(data, "Get all materi ajar success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_materi_by_id(id):
    try:
        data = materi_ajar_model.get_materi_by_id(id)
        if not data:
            return error_response("Materi ajar not found", 404)
        return success_response(data, "Get materi ajar success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_materi():
    try:
        data = request.get_json()
        new_id = materi_ajar_model.create_materi(data)
        return success_response({"id": new_id}, "Materi ajar created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_materi(id):
    try:
        data = request.get_json()
        updated = materi_ajar_model.update_materi(id, data)
        if updated:
            return success_response({}, "Materi ajar updated successfully")
        return error_response("Failed to update materi ajar", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_materi(id):
    try:
        deleted = materi_ajar_model.delete_materi(id)
        if deleted:
            return success_response({}, "Materi ajar deleted successfully")
        return error_response("Failed to delete materi ajar", 400)
    except Exception as e:
        return error_response(str(e), 500)
