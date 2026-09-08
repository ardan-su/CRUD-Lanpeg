from flask import Blueprint, request
from app.models import contact_model
from app.utils.response import success_response, error_response

bp = Blueprint("contact", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_contacts():
    try:
        data = contact_model.get_all_contact()
        return success_response(data, "Get all contact success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_contact_by_id(id):
    try:
        data = contact_model.get_contact_by_id(id)
        if not data:
            return error_response("Contact not found", 404)
        return success_response(data, "Get contact success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_contact():
    try:
        data = request.get_json()
        new_id = contact_model.create_contact(data)
        return success_response({"id": new_id}, "Contact created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_contact(id):
    try:
        data = request.get_json()
        updated = contact_model.update_contact(id, data)
        if updated:
            return success_response({}, "Contact updated successfully")
        return error_response("Failed to update contact", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_contact(id):
    try:
        deleted = contact_model.delete_contact(id)
        if deleted:
            return success_response({}, "Contact deleted successfully")
        return error_response("Failed to delete contact", 400)
    except Exception as e:
        return error_response(str(e), 500)
