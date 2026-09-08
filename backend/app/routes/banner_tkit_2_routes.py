from flask import Blueprint, request
from app.models import banner_tkit_2_model
from app.utils.response import success_response, error_response

bp = Blueprint("banner_tkit_2", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_all():
    try:
        banners = banner_tkit_2_model.get_all_banner_tkit_2()
        return success_response(banners, "Get all banner_tkit_2 success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    try:
        banner = banner_tkit_2_model.get_banner_tkit_2_by_id(id)
        if not banner:
            return error_response("Banner not found", 404)
        return success_response(banner, "Get banner success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def create():
    try:
        data = request.get_json()
        new_id = banner_tkit_2_model.create_banner_tkit_2(data)
        return success_response({"id": new_id}, "Banner created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    try:
        data = request.get_json()
        updated = banner_tkit_2_model.update_banner_tkit_2(id, data)
        if updated:
            return success_response({}, "Banner updated successfully")
        return error_response("Failed to update banner", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    try:
        deleted = banner_tkit_2_model.delete_banner_tkit_2(id)
        if deleted:
            return success_response({}, "Banner deleted successfully")
        return error_response("Failed to delete banner", 400)
    except Exception as e:
        return error_response(str(e), 500)
