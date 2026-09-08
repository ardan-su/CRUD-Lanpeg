from flask import Blueprint, request
from app.models import fasilitas_section_model
from app.utils.response import success_response, error_response

bp = Blueprint("fasilitas_section", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_fasilitas_sections():
    try:
        data = fasilitas_section_model.get_all_fasilitas_section()
        return success_response(data, "Get all fasilitas section success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_fasilitas_section_by_id(id):
    try:
        data = fasilitas_section_model.get_fasilitas_section_by_id(id)
        if not data:
            return error_response("Fasilitas section not found", 404)
        return success_response(data, "Get fasilitas section success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_fasilitas_section():
    try:
        data = request.get_json()
        new_id = fasilitas_section_model.create_fasilitas_section(data)
        return success_response({"id": new_id}, "Fasilitas section created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_fasilitas_section(id):
    try:
        data = request.get_json()
        updated = fasilitas_section_model.update_fasilitas_section(id, data)
        if updated:
            return success_response({}, "Fasilitas section updated successfully")
        return error_response("Failed to update fasilitas section", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_fasilitas_section(id):
    try:
        deleted = fasilitas_section_model.delete_fasilitas_section(id)
        if deleted:
            return success_response({}, "Fasilitas section deleted successfully")
        return error_response("Failed to delete fasilitas section", 400)
    except Exception as e:
        return error_response(str(e), 500)
