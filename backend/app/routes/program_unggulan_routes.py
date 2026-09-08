from flask import Blueprint, request
from app.models import program_unggulan_model
from app.utils.response import success_response, error_response

bp = Blueprint("program_unggulan", __name__)

# GET semua program
@bp.route("/", methods=["GET"])
def get_programs():
    try:
        programs = program_unggulan_model.get_all_programs()
        return success_response(programs, "Get all programs success")
    except Exception as e:
        return error_response(str(e), 500)

# GET program by ID
@bp.route("/<int:id>", methods=["GET"])
def get_program_by_id(id):
    try:
        program = program_unggulan_model.get_program_by_id(id)
        if not program:
            return error_response("Program not found", 404)
        return success_response(program, "Get program success")
    except Exception as e:
        return error_response(str(e), 500)

# GET program by Section ID
@bp.route("/section/<int:section_id>", methods=["GET"])
def get_programs_by_section(section_id):
    try:
        programs = program_unggulan_model.get_programs_by_section(section_id)
        return success_response(programs, "Get programs by section success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah program
@bp.route("/", methods=["POST"])
def add_program():
    try:
        data = request.get_json()
        new_id = program_unggulan_model.create_program(data)
        return success_response({"id": new_id}, "Program created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update program
@bp.route("/<int:id>", methods=["PUT"])
def edit_program(id):
    try:
        data = request.get_json()
        updated = program_unggulan_model.update_program(id, data)
        if updated:
            return success_response({}, "Program updated successfully")
        return error_response("Failed to update program", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus program
@bp.route("/<int:id>", methods=["DELETE"])
def remove_program(id):
    try:
        deleted = program_unggulan_model.delete_program(id)
        if deleted:
            return success_response({}, "Program deleted successfully")
        return error_response("Failed to delete program", 400)
    except Exception as e:
        return error_response(str(e), 500)
