from flask import Blueprint, request
from app.models import kolom_siswa_model
from app.utils.response import success_response, error_response
from app.utils.slug import generate_slug, generate_unique_slug
from app.utils.db import get_db

bp = Blueprint("kolom_siswa", __name__)

# GET semua data
@bp.route("/", methods=["GET"])
def get_kolom_siswa():
    try:
        data = kolom_siswa_model.get_all_kolom_siswa()
        return success_response(data, "Get all kolom siswa success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_kolom_siswa_by_id(id):
    try:
        data = kolom_siswa_model.get_kolom_siswa_by_id(id)
        if not data:
            return error_response("Kolom siswa not found", 404)
        # Increment views
        kolom_siswa_model.increment_views(id)
        return success_response(data, "Get kolom siswa success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by slug
@bp.route("/slug/<slug>", methods=["GET"])
def get_kolom_siswa_by_slug(slug):
    try:
        data = kolom_siswa_model.get_kolom_siswa_by_slug(slug)
        if not data:
            return error_response("Kolom siswa not found", 404)
        # Increment views
        kolom_siswa_model.increment_views(data['id'])
        return success_response(data, "Get kolom siswa success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data
@bp.route("/", methods=["POST"])
def add_kolom_siswa():
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM kolom_siswa")
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        new_id = kolom_siswa_model.create_kolom_siswa(data)
        return success_response({"id": new_id}, "Kolom siswa created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data
@bp.route("/<int:id>", methods=["PUT"])
def edit_kolom_siswa(id):
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug') and data.get('judul'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM kolom_siswa WHERE id != %s", (id,))
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        updated = kolom_siswa_model.update_kolom_siswa(id, data)
        if updated:
            return success_response({}, "Kolom siswa updated successfully")
        return error_response("Failed to update kolom siswa", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data
@bp.route("/<int:id>", methods=["DELETE"])
def remove_kolom_siswa(id):
    try:
        deleted = kolom_siswa_model.delete_kolom_siswa(id)
        if deleted:
            return success_response({}, "Kolom siswa deleted successfully")
        return error_response("Failed to delete kolom siswa", 400)
    except Exception as e:
        return error_response(str(e), 500)
