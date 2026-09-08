from flask import Blueprint, request
from app.models import fasilitas_item_model
from app.utils.response import success_response, error_response

bp = Blueprint("fasilitas_item", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_fasilitas_items():
    try:
        data = fasilitas_item_model.get_all_fasilitas_item()
        return success_response(data, "Get all fasilitas item success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_fasilitas_item_by_id(id):
    try:
        data = fasilitas_item_model.get_fasilitas_item_by_id(id)
        if not data:
            return error_response("Fasilitas item not found", 404)
        return success_response(data, "Get fasilitas item success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_fasilitas_item():
    try:
        data = request.get_json()
        new_id = fasilitas_item_model.create_fasilitas_item(data)
        return success_response({"id": new_id}, "Fasilitas item created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_fasilitas_item(id):
    try:
        data = request.get_json()
        updated = fasilitas_item_model.update_fasilitas_item(id, data)
        if updated:
            return success_response({}, "Fasilitas item updated successfully")
        return error_response("Failed to update fasilitas item", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_fasilitas_item(id):
    try:
        deleted = fasilitas_item_model.delete_fasilitas_item(id)
        if deleted:
            return success_response({}, "Fasilitas item deleted successfully")
        return error_response("Failed to delete fasilitas item", 400)
    except Exception as e:
        return error_response(str(e), 500)
