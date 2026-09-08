from flask import Blueprint, request
from app.models import profil_yayasan_program_kerja_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_program_kerja", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_program_kerja():
    try:
        data = profil_yayasan_program_kerja_model.get_all_program_kerja()
        return success_response(data, "Get all program kerja success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_program_kerja_by_id(id):
    try:
        data = profil_yayasan_program_kerja_model.get_program_kerja_by_id(id)
        if not data:
            return error_response("Program kerja not found", 404)
        return success_response(data, "Get program kerja success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_program_kerja():
    try:
        data = request.get_json()
        new_id = profil_yayasan_program_kerja_model.create_program_kerja(data)
        return success_response({"id": new_id}, "Program kerja created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_program_kerja(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_program_kerja_model.update_program_kerja(id, data)
        if updated:
            return success_response({}, "Program kerja updated successfully")
        return error_response("Failed to update program kerja", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_program_kerja(id):
    try:
        deleted = profil_yayasan_program_kerja_model.delete_program_kerja(id)
        if deleted:
            return success_response({}, "Program kerja deleted successfully")
        return error_response("Failed to delete program kerja", 400)
    except Exception as e:
        return error_response(str(e), 500)
