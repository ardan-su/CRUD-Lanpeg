from flask import Blueprint, request
from app.models import hubungi_kami_model
from app.utils.response import success_response, error_response

bp = Blueprint("hubungi_kami", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_all():
    try:
        data = hubungi_kami_model.get_all_hubungi_kami()
        return success_response(data, "Get all hubungi_kami success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    try:
        data = hubungi_kami_model.get_hubungi_kami_by_id(id)
        if not data:
            return error_response("Hubungi Kami entry not found", 404)
        return success_response(data, "Get hubungi_kami success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def create():
    try:
        data = request.get_json()
        new_id = hubungi_kami_model.create_hubungi_kami(data)
        return success_response({"id": new_id}, "Hubungi Kami created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    try:
        data = request.get_json()
        updated = hubungi_kami_model.update_hubungi_kami(id, data)
        if updated:
            return success_response({}, "Hubungi Kami updated successfully")
        return error_response("Failed to update hubungi_kami", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    try:
        deleted = hubungi_kami_model.delete_hubungi_kami(id)
        if deleted:
            return success_response({}, "Hubungi Kami deleted successfully")
        return error_response("Failed to delete hubungi_kami", 400)
    except Exception as e:
        return error_response(str(e), 500)
