from flask import Blueprint, request
from app.models import profil_yayasan_prestasi_item_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_prestasi_item", __name__)

@bp.route("/<int:prestasi_id>", methods=["GET"])
def get_items_by_prestasi(prestasi_id):
    try:
        data = profil_yayasan_prestasi_item_model.get_items_by_prestasi(prestasi_id)
        return success_response(data, "Get items by prestasi success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/detail/<int:id>", methods=["GET"])
def get_item_by_id(id):
    try:
        data = profil_yayasan_prestasi_item_model.get_item_by_id(id)
        if not data:
            return error_response("Item not found", 404)
        return success_response(data, "Get item success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_item():
    try:
        data = request.get_json()
        new_id = profil_yayasan_prestasi_item_model.create_item(data)
        return success_response({"id": new_id}, "Item created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_item(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_prestasi_item_model.update_item(id, data)
        if updated:
            return success_response({}, "Item updated successfully")
        return error_response("Failed to update item", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_item(id):
    try:
        deleted = profil_yayasan_prestasi_item_model.delete_item(id)
        if deleted:
            return success_response({}, "Item deleted successfully")
        return error_response("Failed to delete item", 400)
    except Exception as e:
        return error_response(str(e), 500)