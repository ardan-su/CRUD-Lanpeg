from flask import Blueprint, request
from app.models import profil_yayasan_prestasi_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_prestasi", __name__)

@bp.route("/", methods=["GET"])
def get_all_prestasi():
    try:
        data = profil_yayasan_prestasi_model.get_all_prestasi()
        return success_response(data, "Get all prestasi success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_prestasi_by_id(id):
    try:
        data = profil_yayasan_prestasi_model.get_prestasi_by_id(id)
        if not data:
            return error_response("Prestasi not found", 404)
        return success_response(data, "Get prestasi success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_prestasi():
    try:
        data = request.get_json()
        new_id = profil_yayasan_prestasi_model.create_prestasi(data)
        return success_response({"id": new_id}, "Prestasi created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_prestasi(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_prestasi_model.update_prestasi(id, data)
        if updated:
            return success_response({}, "Prestasi updated successfully")
        return error_response("Failed to update prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_prestasi(id):
    try:
        deleted = profil_yayasan_prestasi_model.delete_prestasi(id)
        if deleted:
            return success_response({}, "Prestasi deleted successfully")
        return error_response("Failed to delete prestasi", 400)
    except Exception as e:
        return error_response(str(e), 500)
