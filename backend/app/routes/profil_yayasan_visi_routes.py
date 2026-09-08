from flask import Blueprint, request
from app.models import profil_yayasan_visi_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_visi", __name__)

@bp.route("/", methods=["GET"])
def get_all_visi():
    try:
        data = profil_yayasan_visi_model.get_all_visi()
        return success_response(data, "Get all visi success"), 200
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_visi_by_id(id):
    try:
        data = profil_yayasan_visi_model.get_visi_by_id(id)
        if not data:
            return error_response("Visi not found", 404)
        return success_response(data, "Get visi success"), 200
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_visi():
    try:
        # Pastikan JSON
        if not request.is_json:
            return error_response("Content-Type must be application/json", 415)

        data = request.get_json()
        if not data or not data.get("judul") or not data.get("deskripsi") or not data.get("visi"):
            return error_response("Missing required fields: judul, deskripsi, visi", 400)

        new_id = profil_yayasan_visi_model.create_visi(data)
        return success_response({"id": new_id}, "Visi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_visi(id):
    try:
        if not request.is_json:
            return error_response("Content-Type must be application/json", 415)

        data = request.get_json()
        if not data:
            return error_response("Invalid JSON data", 400)

        updated = profil_yayasan_visi_model.update_visi(id, data)
        if updated:
            return success_response({}, "Visi updated successfully"), 200
        return error_response("Failed to update visi", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_visi(id):
    try:
        deleted = profil_yayasan_visi_model.delete_visi(id)
        if deleted:
            return success_response({}, "Visi deleted successfully"), 200
        return error_response("Failed to delete visi", 400)
    except Exception as e:
        return error_response(str(e), 500)
