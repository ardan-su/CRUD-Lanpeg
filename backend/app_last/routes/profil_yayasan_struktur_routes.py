from flask import Blueprint, request
from app.models import profil_yayasan_struktur_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_struktur", __name__)

@bp.route("/", methods=["GET"])
def get_all_struktur():
    try:
        data = profil_yayasan_struktur_model.get_all_struktur()
        return success_response(data, "Get all struktur success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_struktur_by_id(id):
    try:
        data = profil_yayasan_struktur_model.get_struktur_by_id(id)
        if not data:
            return error_response("Struktur not found", 404)
        return success_response(data, "Get struktur success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_struktur():
    try:
        data = request.get_json()
        new_id = profil_yayasan_struktur_model.create_struktur(data)
        return success_response({"id": new_id}, "Struktur created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_struktur(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_struktur_model.update_struktur(id, data)
        if updated:
            return success_response({}, "Struktur updated successfully")
        return error_response("Failed to update struktur", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_struktur(id):
    try:
        deleted = profil_yayasan_struktur_model.delete_struktur(id)
        if deleted:
            return success_response({}, "Struktur deleted successfully")
        return error_response("Failed to delete struktur", 400)
    except Exception as e:
        return error_response(str(e), 500)
