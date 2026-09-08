from flask import Blueprint, request
from app.models import informasi_berita_model
from app.utils.response import success_response, error_response
from app.utils.slug import generate_slug, generate_unique_slug
from app.utils.db import get_db

bp = Blueprint("informasi_berita", __name__)

# GET semua data informasi_berita
@bp.route("/", methods=["GET"])
def get_informasi_berita():
    try:
        berita = informasi_berita_model.get_all_informasi_berita()
        return success_response(berita, "Get all informasi berita success")
    except Exception as e:
        return error_response(str(e), 500)

# GET data informasi_berita berdasarkan ID
@bp.route("/<int:id>", methods=["GET"])
def get_informasi_berita_by_id(id):
    try:
        berita = informasi_berita_model.get_informasi_berita_by_id(id)
        if not berita:
            return error_response("Informasi berita not found", 404)
        # Increment views
        informasi_berita_model.increment_views(id)
        return success_response(berita, "Get informasi berita success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by slug
@bp.route("/slug/<slug>", methods=["GET"])
def get_informasi_berita_by_slug(slug):
    try:
        berita = informasi_berita_model.get_informasi_berita_by_slug(slug)
        if not berita:
            return error_response("Informasi berita not found", 404)
        # Increment views
        informasi_berita_model.increment_views(berita['id'])
        return success_response(berita, "Get informasi berita success")
    except Exception as e:
        return error_response(str(e), 500)

# POST tambah data informasi_berita
@bp.route("/", methods=["POST"])
def add_informasi_berita():
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM informasi_berita")
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        new_id = informasi_berita_model.create_informasi_berita(data)
        return success_response({"id": new_id}, "Informasi berita created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update data informasi_berita
@bp.route("/<int:id>", methods=["PUT"])
def edit_informasi_berita(id):
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug') and data.get('judul'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM informasi_berita WHERE id != %s", (id,))
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        updated = informasi_berita_model.update_informasi_berita(id, data)
        if updated:
            return success_response({}, "Informasi berita updated successfully")
        return error_response("Failed to update informasi berita", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE hapus data informasi_berita
@bp.route("/<int:id>", methods=["DELETE"])
def remove_informasi_berita(id):
    try:
        deleted = informasi_berita_model.delete_informasi_berita(id)
        if deleted:
            return success_response({}, "Informasi berita deleted successfully")
        return error_response("Failed to delete informasi berita", 400)
    except Exception as e:
        return error_response(str(e), 500)
