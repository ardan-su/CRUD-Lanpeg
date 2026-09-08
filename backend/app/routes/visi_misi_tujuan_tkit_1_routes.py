from flask import Blueprint, request
from app.models import visi_misi_tujuan_tkit_1_model
from app.utils.response import success_response, error_response

bp = Blueprint("visi_misi_tujuan_tkit_1", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_all_visi_misi_tujuan():
    try:
        data = visi_misi_tujuan_tkit_1_model.get_all_visi_misi_tujuan()
        return success_response(data, "Get all visi misi tujuan success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_visi_misi_tujuan_by_id(id):
    try:
        data = visi_misi_tujuan_tkit_1_model.get_visi_misi_tujuan_by_id(id)
        if not data:
            return error_response("Visi misi tujuan not found", 404)
        return success_response(data, "Get visi misi tujuan success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_visi_misi_tujuan():
    try:
        data = request.get_json()
        new_id = visi_misi_tujuan_tkit_1_model.create_visi_misi_tujuan(data)
        return success_response({"id": new_id}, "Visi misi tujuan created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_visi_misi_tujuan(id):
    try:
        data = request.get_json()
        updated = visi_misi_tujuan_tkit_1_model.update_visi_misi_tujuan(id, data)
        if updated:
            return success_response({}, "Visi misi tujuan updated successfully")
        return error_response("Failed to update visi misi tujuan", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_visi_misi_tujuan(id):
    try:
        deleted = visi_misi_tujuan_tkit_1_model.delete_visi_misi_tujuan(id)
        if deleted:
            return success_response({}, "Visi misi tujuan deleted successfully")
        return error_response("Failed to delete visi misi tujuan", 400)
    except Exception as e:
        return error_response(str(e), 500)
