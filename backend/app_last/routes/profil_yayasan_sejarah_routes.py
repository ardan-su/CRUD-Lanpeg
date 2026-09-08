from flask import Blueprint, request
from app.models import profil_yayasan_sejarah_model
from app.utils.response import success_response, error_response

bp = Blueprint("profil_yayasan_sejarah", __name__)

@bp.route("/", methods=["GET"])
def get_all_sejarah():
    try:
        data = profil_yayasan_sejarah_model.get_all_sejarah()
        return success_response(data, "Get all sejarah success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["GET"])
def get_sejarah_by_id(id):
    try:
        data = profil_yayasan_sejarah_model.get_sejarah_by_id(id)
        if not data:
            return error_response("Sejarah not found", 404)
        return success_response(data, "Get sejarah success")
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/", methods=["POST"])
def create_sejarah():
    try:
        data = request.get_json()
        new_id = profil_yayasan_sejarah_model.create_sejarah(data)
        return success_response({"id": new_id}, "Sejarah created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["PUT"])
def update_sejarah(id):
    try:
        data = request.get_json()
        updated = profil_yayasan_sejarah_model.update_sejarah(id, data)
        if updated:
            return success_response({}, "Sejarah updated successfully")
        return error_response("Failed to update sejarah", 400)
    except Exception as e:
        return error_response(str(e), 500)

@bp.route("/<int:id>", methods=["DELETE"])
def delete_sejarah(id):
    try:
        deleted = profil_yayasan_sejarah_model.delete_sejarah(id)
        if deleted:
            return success_response({}, "Sejarah deleted successfully")
        return error_response("Failed to delete sejarah", 400)
    except Exception as e:
        return error_response(str(e), 500)
