from flask import Blueprint, request
from app.models import media_sosial_model
from app.utils.response import success_response, error_response

bp = Blueprint("media_sosial", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_media():
    try:
        media = media_sosial_model.get_all_media()
        return success_response(media, "Get all media sosial success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_media_by_id(id):
    try:
        media = media_sosial_model.get_media_by_id(id)
        if not media:
            return error_response("Media sosial not found", 404)
        return success_response(media, "Get media sosial success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_media():
    try:
        data = request.get_json()
        new_id = media_sosial_model.create_media(data)
        return success_response({"id": new_id}, "Media sosial created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_media(id):
    try:
        data = request.get_json()
        updated = media_sosial_model.update_media(id, data)
        if updated:
            return success_response({}, "Media sosial updated successfully")
        return error_response("Failed to update media sosial", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_media(id):
    try:
        deleted = media_sosial_model.delete_media(id)
        if deleted:
            return success_response({}, "Media sosial deleted successfully")
        return error_response("Failed to delete media sosial", 400)
    except Exception as e:
        return error_response(str(e), 500)
