from flask import Blueprint, request
from app.models import komite_pomg_model
from app.utils.response import success_response, error_response

bp = Blueprint("komite_pomg", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_komite():
    try:
        data = komite_pomg_model.get_all_komite()
        return success_response(data, "Get all Komite success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_komite_by_id(id):
    try:
        data = komite_pomg_model.get_komite_by_id(id)
        if not data:
            return error_response("Komite not found", 404)
        return success_response(data, "Get Komite success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_komite():
    try:
        data = request.get_json()
        new_id = komite_pomg_model.create_komite(data)
        return success_response({"id": new_id}, "Komite created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_komite(id):
    try:
        data = request.get_json()
        updated = komite_pomg_model.update_komite(id, data)
        if updated:
            return success_response({}, "Komite updated successfully")
        return error_response("Failed to update Komite", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_komite(id):
    try:
        deleted = komite_pomg_model.delete_komite(id)
        if deleted:
            return success_response({}, "Komite deleted successfully")
        return error_response("Failed to delete Komite", 400)
    except Exception as e:
        return error_response(str(e), 500)
