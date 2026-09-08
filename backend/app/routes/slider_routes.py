from flask import Blueprint, request, jsonify
from app.models import slider_model
from app.utils.response import success_response, error_response

bp = Blueprint("slider", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_sliders():
    try:
        sliders = slider_model.get_all_sliders()
        return success_response(sliders, "Get all sliders success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_slider(id):
    try:
        slider = slider_model.get_slider_by_id(id)
        if not slider:
            return error_response("Slider not found", 404)
        return success_response(slider, "Get slider success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_slider():
    try:
        data = request.get_json()
        new_id = slider_model.create_slider(data)
        return success_response({"id": new_id}, "Slider created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_slider(id):
    try:
        data = request.get_json()
        updated = slider_model.update_slider(id, data)
        if updated:
            return success_response({}, "Slider updated successfully")
        return error_response("Failed to update slider", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_slider(id):
    try:
        deleted = slider_model.delete_slider(id)
        if deleted:
            return success_response({}, "Slider deleted successfully")
        return error_response("Failed to delete slider", 400)
    except Exception as e:
        return error_response(str(e), 500)
