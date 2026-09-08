from flask import Blueprint, request
from app.models import majalah_digital_model
from app.utils.response import success_response, error_response
from app.utils.slug import generate_slug, generate_unique_slug
from app.utils.db import get_db

bp = Blueprint("majalah_digital", __name__)

# GET semua majalah digital
@bp.route("/", methods=["GET"])
def get_majalah_digital():
    try:
        majalah = majalah_digital_model.get_all_majalah_digital()
        return success_response(majalah, "Get all majalah digital success")
    except Exception as e:
        return error_response(str(e), 500)

# GET majalah digital by ID
@bp.route("/<int:id>", methods=["GET"])
def get_majalah_digital_by_id(id):
    try:
        majalah = majalah_digital_model.get_majalah_digital_by_id(id)
        if not majalah:
            return error_response("Majalah digital not found", 404)
        # Increment views
        majalah_digital_model.increment_views(id)
        return success_response(majalah, "Get majalah digital success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by slug
@bp.route("/slug/<slug>", methods=["GET"])
def get_majalah_digital_by_slug(slug):
    try:
        majalah = majalah_digital_model.get_majalah_digital_by_slug(slug)
        if not majalah:
            return error_response("Majalah digital not found", 404)
        # Increment views
        majalah_digital_model.increment_views(majalah['id'])
        return success_response(majalah, "Get majalah digital success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah majalah digital
@bp.route("/", methods=["POST"])
def add_majalah_digital():
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM majalah_digital")
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        new_id = majalah_digital_model.create_majalah_digital(data)
        return success_response({"id": new_id}, "Majalah digital created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update majalah digital
@bp.route("/<int:id>", methods=["PUT"])
def edit_majalah_digital(id):
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug') and data.get('judul'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM majalah_digital WHERE id != %s", (id,))
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        updated = majalah_digital_model.update_majalah_digital(id, data)
        if updated:
            return success_response({}, "Majalah digital updated successfully")
        return error_response("Failed to update majalah digital", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus majalah digital
@bp.route("/<int:id>", methods=["DELETE"])
def remove_majalah_digital(id):
    try:
        deleted = majalah_digital_model.delete_majalah_digital(id)
        if deleted:
            return success_response({}, "Majalah digital deleted successfully")
        return error_response("Failed to delete majalah digital", 400)
    except Exception as e:
        return error_response(str(e), 500)
