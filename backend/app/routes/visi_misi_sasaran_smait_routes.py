from flask import Blueprint, request
from app.models import visi_misi_sasaran_smait_model
from app.utils.response import success_response, error_response

bp = Blueprint("visi_misi_sasaran_smait", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_visi_misi_sasaran():
    try:
        data = visi_misi_sasaran_smait_model.get_all()
        return success_response(data, "Get all Visi/Misi/Sasaran SMAIT success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_visi_misi_sasaran_by_id(id):
    try:
        data = visi_misi_sasaran_smait_model.get_by_id(id)
        if not data:
            return error_response("Data not found", 404)
        return success_response(data, "Get Visi/Misi/Sasaran success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_visi_misi_sasaran():
    try:
        data = request.get_json()
        new_id = visi_misi_sasaran_smait_model.create(data)
        return success_response({"id": new_id}, "Data created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_visi_misi_sasaran(id):
    try:
        data = request.get_json()
        updated = visi_misi_sasaran_smait_model.update(id, data)
        if updated:
            return success_response({}, "Data updated successfully")
        return error_response("Failed to update data", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_visi_misi_sasaran(id):
    try:
        deleted = visi_misi_sasaran_smait_model.delete(id)
        if deleted:
            return success_response({}, "Data deleted successfully")
        return error_response("Failed to delete data", 400)
    except Exception as e:
        return error_response(str(e), 500)
