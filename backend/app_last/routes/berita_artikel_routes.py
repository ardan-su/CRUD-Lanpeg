from flask import Blueprint, request
from app.models import berita_artikel_model
from app.utils.response import success_response, error_response
from app.utils.slug import generate_slug, generate_unique_slug
from app.utils.db import get_db

bp = Blueprint("berita_artikel", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_berita():
    try:
        berita = berita_artikel_model.get_all_berita()
        return success_response(berita, "Get all berita success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_berita_by_id(id):
    try:
        berita = berita_artikel_model.get_berita_by_id(id)
        if not berita:
            return error_response("Berita not found", 404)
        # Increment views
        berita_artikel_model.increment_views(id)
        return success_response(berita, "Get berita success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by slug
@bp.route("/slug/<slug>", methods=["GET"])
def get_berita_by_slug(slug):
    try:
        berita = berita_artikel_model.get_berita_by_slug(slug)
        if not berita:
            return error_response("Berita not found", 404)
        # Increment views
        berita_artikel_model.increment_views(berita['id'])
        return success_response(berita, "Get berita success")
    except Exception as e:
        return error_response(str(e), 500)

# POST
@bp.route("/", methods=["POST"])
def add_berita():
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM berita_artikel")
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        new_id = berita_artikel_model.create_berita(data)
        return success_response({"id": new_id}, "Berita created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT
@bp.route("/<int:id>", methods=["PUT"])
def edit_berita(id):
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug') and data.get('judul'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM berita_artikel WHERE id != %s", (id,))
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        updated = berita_artikel_model.update_berita(id, data)
        if updated:
            return success_response({}, "Berita updated successfully")
        return error_response("Failed to update berita", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def remove_berita(id):
    try:
        deleted = berita_artikel_model.delete_berita(id)
        if deleted:
            return success_response({}, "Berita deleted successfully")
        return error_response("Failed to delete berita", 400)
    except Exception as e:
        return error_response(str(e), 500)
