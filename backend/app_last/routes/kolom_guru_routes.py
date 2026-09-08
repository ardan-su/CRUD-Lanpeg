from flask import Blueprint, request
from app.models import kolom_guru_model
from app.utils.response import success_response, error_response
from app.utils.slug import generate_slug, generate_unique_slug
from app.utils.db import get_db

bp = Blueprint("kolom_guru", __name__)

# GET all
@bp.route("/", methods=["GET"])
def get_all_kolom():
    try:
        data = kolom_guru_model.get_all_kolom()
        return success_response(data, "Get all kolom guru success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by ID
@bp.route("/<int:id>", methods=["GET"])
def get_kolom_by_id(id):
    try:
        data = kolom_guru_model.get_kolom_by_id(id)
        if not data:
            return error_response("Kolom guru not found", 404)
        # Increment views
        kolom_guru_model.increment_views(id)
        return success_response(data, "Get kolom guru success")
    except Exception as e:
        return error_response(str(e), 500)

# GET by slug
@bp.route("/slug/<slug>", methods=["GET"])
def get_kolom_by_slug(slug):
    try:
        data = kolom_guru_model.get_kolom_by_slug(slug)
        if not data:
            return error_response("Kolom guru not found", 404)
        # Increment views
        kolom_guru_model.increment_views(data['id'])
        return success_response(data, "Get kolom guru success")
    except Exception as e:
        return error_response(str(e), 500)

# POST create
@bp.route("/", methods=["POST"])
def create_kolom():
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM kolom_guru")
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        new_id = kolom_guru_model.create_kolom(data)
        return success_response({"id": new_id}, "Kolom guru created successfully"), 201
    except Exception as e:
        return error_response(str(e), 500)

# PUT update
@bp.route("/<int:id>", methods=["PUT"])
def update_kolom(id):
    try:
        data = request.get_json()
        
        # Generate slug if not provided
        if not data.get('slug') and data.get('judul'):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT slug FROM kolom_guru WHERE id != %s", (id,))
            existing_slugs = [row[0] for row in cursor.fetchall()]
            cursor.close()
            data['slug'] = generate_unique_slug(data.get('judul', ''), existing_slugs)
        
        updated = kolom_guru_model.update_kolom(id, data)
        if updated:
            return success_response({}, "Kolom guru updated successfully")
        return error_response("Failed to update kolom guru", 400)
    except Exception as e:
        return error_response(str(e), 500)

# DELETE
@bp.route("/<int:id>", methods=["DELETE"])
def delete_kolom(id):
    try:
        deleted = kolom_guru_model.delete_kolom(id)
        if deleted:
            return success_response({}, "Kolom guru deleted successfully")
        return error_response("Failed to delete kolom guru", 400)
    except Exception as e:
        return error_response(str(e), 500)
