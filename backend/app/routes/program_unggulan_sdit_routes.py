from flask import Blueprint, request
from app.models import program_unggulan_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("program_unggulan_sdit", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_all_program():
    try:
        programs = program_unggulan_sdit_model.get_all_program()
        return success_response(programs, "Get all program unggulan success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_program_by_id(id):
    try:
        program = program_unggulan_sdit_model.get_program_by_id(id)
        if not program:
            return error_response("Program unggulan not found", 404)
        return success_response(program, "Get program unggulan success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_program():
    try:
        data = request.get_json()
        new_id = program_unggulan_sdit_model.create_program(data)
        return success_response({"id": new_id}, "Program unggulan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_program(id):
    try:
        data = request.get_json()
        updated = program_unggulan_sdit_model.update_program(id, data)
        if updated:
            return success_response({}, "Program unggulan updated successfully")
        return error_response("Failed to update program unggulan", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_program(id):
    try:
        deleted = program_unggulan_sdit_model.delete_program(id)
        if deleted:
            return success_response({}, "Program unggulan deleted successfully")
        return error_response("Failed to delete program unggulan", 400)
    except Exception as e:
        return error_response(str(e), 500)
