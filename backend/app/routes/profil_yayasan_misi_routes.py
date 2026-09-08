from flask import Blueprint, request
from app.models import profil_yayasan_misi_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_misi", __name__)

@bp.route("/", methods=["GET"])
def get_all_misi():
    try:
        data = profil_yayasan_misi_model.get_all_misi()
        return success_response(data, "Get all misi success"), 200
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_misi_by_id(id):
    try:
        data = profil_yayasan_misi_model.get_misi_by_id(id)
        if not data:
            return error_response("Misi not found", 404)
        return success_response(data, "Get misi success"), 200
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_misi():
    try:
        # Validasi content-type
        if not request.is_json:
            return error_response("Content-Type must be application/json", 415)

        data = request.get_json()
        if not data or not data.get("profil_id") or not data.get("nomor") or not data.get("isi"):
            return error_response("Missing required fields: profil_id, nomor, isi", 400)

        new_id = profil_yayasan_misi_model.create_misi(data)
        return success_response({"id": new_id}, "Misi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_misi(id):
    try:
        if not request.is_json:
            return error_response("Content-Type must be application/json", 415)

        data = request.get_json()
        if not data:
            return error_response("Invalid JSON data", 400)

        updated = profil_yayasan_misi_model.update_misi(id, data)
        if updated:
            return success_response({}, "Misi updated successfully"), 200
        return error_response("Failed to update misi", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_misi(id):
    try:
        deleted = profil_yayasan_misi_model.delete_misi(id)
        if deleted:
            return success_response({}, "Misi deleted successfully"), 200
        return error_response("Failed to delete misi", 400)
    except Exception as e:
        return error_response(str(e), 500)
