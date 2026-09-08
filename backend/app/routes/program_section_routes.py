from flask import Blueprint, request
from app.models import program_section_model   # ✅ ini sudah benar
from app.utils.response import success_response, error_response

bp = Blueprint("program_section", __name__)

# GET semua section
@bp.route("/", methods=["GET"])
def get_sections():
    try:
        sections = program_section_model.get_all_sections()  # ✅ pakai _model
        return success_response(sections, "Get all sections success")
    except Exception as e:
        return error_response(str(e), 500)

# GET section by ID
@bp.route("/<int:id>", methods=["GET"])
def get_section_by_id(id):
    try:
        section = program_section_model.get_section_by_id(id)  # ✅ pakai _model
        if not section:
            return error_response("Section not found", 404)
        return success_response(section, "Get section success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah section
@bp.route("/", methods=["POST"])
def add_section():
    try:
        data = request.get_json()
        new_id = program_section_model.create_section(data)  # ✅ pakai _model
        return success_response({"id": new_id}, "Section created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update section
@bp.route("/<int:id>", methods=["PUT"])
def edit_section(id):
    try:
        data = request.get_json()
        updated = program_section_model.update_section(id, data)  # ✅ pakai _model
        if updated:
            return success_response({}, "Section updated successfully")
        return error_response("Failed to update section", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus section
@bp.route("/<int:id>", methods=["DELETE"])
def remove_section(id):
    try:
        deleted = program_section_model.delete_section(id)  # ✅ pakai _model
        if deleted:
            return success_response({}, "Section deleted successfully")
        return error_response("Failed to delete section", 400)
    except Exception as e:
        return error_response(str(e), 500)
