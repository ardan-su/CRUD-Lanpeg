from flask import Blueprint, request
from app.models import program_kejuruan_smkit_model
from app.utils.response import success_response, error_response

bp = Blueprint("program_kejuruan_smkit", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_program_kejuruan():
    try:
        data = program_kejuruan_smkit_model.get_all()
        return success_response(data, "Get all program kejuruan SMKIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_program_kejuruan_by_id(id):
    try:
        data = program_kejuruan_smkit_model.get_by_id(id)
        if not data:
            return error_response("Program kejuruan not found", 404)
        return success_response(data, "Get program kejuruan success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_program_kejuruan():
    try:
        data = request.get_json()
        new_id = program_kejuruan_smkit_model.create(data)
        return success_response({"id": new_id}, "Program kejuruan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_program_kejuruan(id):
    try:
        data = request.get_json()
        updated = program_kejuruan_smkit_model.update(id, data)
        if updated:
            return success_response({}, "Program kejuruan updated successfully")
        return error_response("Failed to update program kejuruan", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_program_kejuruan(id):
    try:
        deleted = program_kejuruan_smkit_model.delete(id)
        if deleted:
            return success_response({}, "Program kejuruan deleted successfully")
        return error_response("Failed to delete program kejuruan", 400)
    except Exception as e:
        return error_response(str(e), 500)
