from flask import Blueprint, request
from app.models import profil_yayasan_keluarga_besar_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_keluarga_besar", __name__)

@bp.route("/", methods=["GET"])
def get_all_keluarga():
    try:
        data = profil_yayasan_keluarga_besar_model.get_all_keluarga()
        return success_response(data, "Get all keluarga besar success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_keluarga_by_id(id):
    try:
        data = profil_yayasan_keluarga_besar_model.get_keluarga_by_id(id)
        if not data:
            return error_response("Keluarga not found", 404)
        return success_response(data, "Get keluarga success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_keluarga():
    try:
        data = request.get_json()
        new_id = profil_yayasan_keluarga_besar_model.create_keluarga(data)
        return success_response({"id": new_id}, "Keluarga created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_keluarga(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_keluarga_besar_model.update_keluarga(id, data)
        if updated:
            return success_response({}, "Keluarga updated successfully")
        return error_response("Failed to update keluarga", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_keluarga(id):
    try:
        deleted = profil_yayasan_keluarga_besar_model.delete_keluarga(id)
        if deleted:
            return success_response({}, "Keluarga deleted successfully")
        return error_response("Failed to delete keluarga", 400)
    except Exception as e:
        return error_response(str(e), 500)
