from flask import Blueprint, request
from app.models import jenjang_pendidikan_model
from app.utils.response import success_response, error_response

bp = Blueprint("jenjang_pendidikan", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_jenjang():
    try:
        jenjang = jenjang_pendidikan_model.get_all_jenjang()
        return success_response(jenjang, "Get all jenjang pendidikan success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_jenjang_by_id(id):
    try:
        jenjang = jenjang_pendidikan_model.get_jenjang_by_id(id)
        if not jenjang:
            return error_response("Jenjang pendidikan not found", 404)
        return success_response(jenjang, "Get jenjang pendidikan success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_jenjang():
    try:
        data = request.get_json()
        new_id = jenjang_pendidikan_model.create_jenjang(data)
        return success_response({"id": new_id}, "Jenjang pendidikan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_jenjang(id):
    try:
        data = request.get_json()
        updated = jenjang_pendidikan_model.update_jenjang(id, data)
        if updated:
            return success_response({}, "Jenjang pendidikan updated successfully")
        return error_response("Failed to update jenjang pendidikan", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_jenjang(id):
    try:
        deleted = jenjang_pendidikan_model.delete_jenjang(id)
        if deleted:
            return success_response({}, "Jenjang pendidikan deleted successfully")
        return error_response("Failed to delete jenjang pendidikan", 400)
    except Exception as e:
        return error_response(str(e), 500)
