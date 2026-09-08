from flask import Blueprint, request
from app.models import banner_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("banner_sdit", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_banner_sdit():
    try:
        banners = banner_sdit_model.get_all_banner_sdit()
        return success_response(banners, "Get all banner SDIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_banner_sdit_by_id(id):
    try:
        banner = banner_sdit_model.get_banner_sdit_by_id(id)
        if not banner:
            return error_response("Banner SDIT not found", 404)
        return success_response(banner, "Get banner SDIT success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_banner_sdit():
    try:
        data = request.get_json()
        new_id = banner_sdit_model.create_banner_sdit(data)
        return success_response({"id": new_id}, "Banner SDIT created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_banner_sdit(id):
    try:
        data = request.get_json()
        updated = banner_sdit_model.update_banner_sdit(id, data)
        if updated:
            return success_response({}, "Banner SDIT updated successfully")
        return error_response("Failed to update banner SDIT", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_banner_sdit(id):
    try:
        deleted = banner_sdit_model.delete_banner_sdit(id)
        if deleted:
            return success_response({}, "Banner SDIT deleted successfully")
        return error_response("Failed to delete banner SDIT", 400)
    except Exception as e:
        return error_response(str(e), 500)
