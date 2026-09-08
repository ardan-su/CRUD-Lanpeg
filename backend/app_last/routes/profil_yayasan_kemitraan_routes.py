from flask import Blueprint, request
from app.models import profil_yayasan_kemitraan_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_kemitraan", __name__)

@bp.route("/", methods=["GET"])
def get_all_kemitraan():
    try:
        data = profil_yayasan_kemitraan_model.get_all_kemitraan()
        return success_response(data, "Get all kemitraan success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_kemitraan_by_id(id):
    try:
        data = profil_yayasan_kemitraan_model.get_kemitraan_by_id(id)
        if not data:
            return error_response("Kemitraan not found", 404)
        return success_response(data, "Get kemitraan success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_kemitraan():
    try:
        data = request.get_json()
        new_id = profil_yayasan_kemitraan_model.create_kemitraan(data)
        return success_response({"id": new_id}, "Kemitraan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_kemitraan(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_kemitraan_model.update_kemitraan(id, data)
        if updated:
            return success_response({}, "Kemitraan updated successfully")
        return error_response("Failed to update kemitraan", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_kemitraan(id):
    try:
        deleted = profil_yayasan_kemitraan_model.delete_kemitraan(id)
        if deleted:
            return success_response({}, "Kemitraan deleted successfully")
        return error_response("Failed to delete kemitraan", 400)
    except Exception as e:
        return error_response(str(e), 500)
