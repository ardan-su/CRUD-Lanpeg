from flask import Blueprint, request
from app.models import profil_yayasan_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan", __name__)

@bp.route("/", methods=["GET"])
def get_all_profil():
    try:
        data = profil_yayasan_model.get_all_profil()
        return success_response(data, "Get all profil yayasan success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_profil_by_id(id):
    try:
        data = profil_yayasan_model.get_profil_by_id(id)
        if not data:
            return error_response("Profil not found", 404)
        return success_response(data, "Get profil yayasan success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_profil():
    try:
        data = request.get_json()
        new_id = profil_yayasan_model.create_profil(data)
        return success_response({"id": new_id}, "Profil yayasan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_profil(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_model.update_profil(id, data)
        if updated:
            return success_response({}, "Profil yayasan updated successfully")
        return error_response("Failed to update profil yayasan", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_profil(id):
    try:
        deleted = profil_yayasan_model.delete_profil(id)
        if deleted:
            return success_response({}, "Profil yayasan deleted successfully")
        return error_response("Failed to delete profil yayasan", 400)
    except Exception as e:
        return error_response(str(e), 500)
