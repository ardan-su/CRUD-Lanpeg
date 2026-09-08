from flask import Blueprint, request
from app.models import visi_misi_sasaran_sdit_model
from app.utils.response import success_response, error_response

bp = Blueprint("visi_misi_sasaran_sdit", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_all():
    try:
        data = visi_misi_sasaran_sdit_model.get_all_visi_misi_sasaran()
        return success_response(data, "Get all visi/misi/sasaran success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    try:
        data = visi_misi_sasaran_sdit_model.get_visi_misi_sasaran_by_id(id)
        if not data:
            return error_response("Data not found", 404)
        return success_response(data, "Get data success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def create():
    try:
        req = request.get_json()
        new_id = visi_misi_sasaran_sdit_model.create_visi_misi_sasaran(req)
        return success_response({"id": new_id}, "Data created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    try:
        req = request.get_json()
        updated = visi_misi_sasaran_sdit_model.update_visi_misi_sasaran(id, req)
        if updated:
            return success_response({}, "Data updated successfully")
        return error_response("Failed to update data", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    try:
        deleted = visi_misi_sasaran_sdit_model.delete_visi_misi_sasaran(id)
        if deleted:
            return success_response({}, "Data deleted successfully")
        return error_response("Failed to delete data", 400)
    except Exception as e:
        return error_response(str(e), 500)
