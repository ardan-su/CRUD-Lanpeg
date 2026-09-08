from flask import Blueprint, request
from app.models import banner_smait_model
from app.utils.response import success_response, error_response

bp = Blueprint("banner_smait", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_banner():
    try:
        banners = banner_smait_model.get_all_banner()
        return success_response(banners, "Get all banner success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_banner_by_id(id):
    try:
        banner = banner_smait_model.get_banner_by_id(id)
        if not banner:
            return error_response("Banner not found", 404)
        return success_response(banner, "Get banner success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_banner():
    try:
        data = request.get_json()
        new_id = banner_smait_model.create_banner(data)
        return success_response({"id": new_id}, "Banner created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_banner(id):
    try:
        data = request.get_json()
        updated = banner_smait_model.update_banner(id, data)
        if updated:
            return success_response({}, "Banner updated successfully")
        return error_response("Failed to update banner", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_banner(id):
    try:
        deleted = banner_smait_model.delete_banner(id)
        if deleted:
            return success_response({}, "Banner deleted successfully")
        return error_response("Failed to delete banner", 400)
    except Exception as e:
        return error_response(str(e), 500)
