
from flask import Blueprint, request, jsonify
from app.services.role_service import (
    get_all_role, get_role_by_id, create_role, update_role, delete_role
)

bp = Blueprint('role', __name__, url_prefix='/role')

@bp.route('', methods=['GET'])
def get_role_list():
    role_list = get_all_role()
    return jsonify({
        "success": True,
        "data": [r.to_dict() for r in role_list]
    })

@bp.route('/<int:id>', methods=['GET'])
def get_role(id):
    role = get_role_by_id(id)
    if not role:
        return jsonify({"success": False, "message": "Role tidak ditemukan."}), 404
    return jsonify({
        "success": True,
        "data": role.to_dict()
    })

@bp.route('', methods=['POST'])
def create_role_api():
    data = request.json
    role = create_role(data)
    return jsonify({"success": True, "data": role.to_dict()}), 201

@bp.route('/<int:id>', methods=['PUT'])
def update_role_api(id):
    data = request.json
    role = update_role(id, data)
    if not role:
        return jsonify({"success": False, "message": "Role tidak ditemukan."}), 404
    return jsonify({"success": True, "data": role.to_dict()})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_role_api(id):
    result = delete_role(id)
    if not result:
        return jsonify({"success": False, "message": "Role tidak ditemukan."}), 404
    return jsonify({"success": True, "message": "Role berhasil dihapus."})
