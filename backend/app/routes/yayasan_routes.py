from flask import Blueprint, request, jsonify
from app.models import yayasan_model
from app.utils.response import success_response, error_response

bp = Blueprint("yayasan", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_yayasan():
    try:
        yayasan = yayasan_model.get_all_yayasan()
        return success_response(yayasan, "Get all yayasan success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_yayasan_by_id(id):
    try:
        yayasan = yayasan_model.get_yayasan_by_id(id)
        if not yayasan:
            return error_response("Yayasan not found", 404)
        return success_response(yayasan, "Get yayasan success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_yayasan():
    try:
        data = request.get_json()
        new_id = yayasan_model.create_yayasan(data)
        return success_response({"id": new_id}, "Yayasan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_yayasan(id):
    try:
        data = request.get_json()
        updated = yayasan_model.update_yayasan(id, data)
        if updated:
            return success_response({}, "Yayasan updated successfully")
        return error_response("Failed to update yayasan", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_yayasan(id):
    try:
        deleted = yayasan_model.delete_yayasan(id)
        if deleted:
            return success_response({}, "Yayasan deleted successfully")
        return error_response("Failed to delete yayasan", 400)
    except Exception as e:
        return error_response(str(e), 500)