from flask import Flask, send_from_directory, request
from flask_cors import CORS
from .config import Config
import os
import uuid
import logging
from werkzeug.utils import secure_filename
from .utils.response import success_response, error_response

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ========================
    # Logging
    # ========================
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    # ========================
    # Upload Configuration
    # ========================
    app.config['UPLOAD_FOLDER'] = 'public/uploads'
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'pdf'}

    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        logger.info(f"Created upload folder: {upload_folder}")

    # ========================
    # CORS
    # ========================
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ========================
    # Register Blueprints
    # ========================
    from .routes import slider_routes
    app.register_blueprint(slider_routes.bp, url_prefix="/api/slider")

    from .routes import yayasan_routes
    app.register_blueprint(yayasan_routes.bp, url_prefix="/api/yayasan")

    from .routes import program_section_routes
    app.register_blueprint(program_section_routes.bp, url_prefix="/api/program-section")

    from .routes import program_unggulan_routes
    app.register_blueprint(program_unggulan_routes.bp, url_prefix="/api/program-unggulan")
    
    from .routes import berita_artikel_routes
    app.register_blueprint(berita_artikel_routes.bp, url_prefix="/api/berita-artikel")

    from .routes import penerimaan_siswa_baru_routes
    app.register_blueprint(penerimaan_siswa_baru_routes.bp, url_prefix="/api/penerimaan-siswa-baru")

    from .routes import media_sosial_routes
    app.register_blueprint(media_sosial_routes.bp, url_prefix="/api/media-sosial")

    from .routes import jenjang_pendidikan_routes
    app.register_blueprint(jenjang_pendidikan_routes.bp, url_prefix="/api/jenjang-pendidikan")

    from .routes import profil_yayasan_routes
    app.register_blueprint(profil_yayasan_routes.bp, url_prefix="/api/profil-yayasan")

    from .routes import profil_yayasan_visi_routes
    app.register_blueprint(profil_yayasan_visi_routes.bp, url_prefix="/api/profil-yayasan/visi")

    from .routes import profil_yayasan_misi_routes
    app.register_blueprint(profil_yayasan_misi_routes.bp, url_prefix="/api/profil-yayasan/misi")

    from .routes import profil_yayasan_sejarah_routes
    app.register_blueprint(profil_yayasan_sejarah_routes.bp, url_prefix="/api/profil_yayasan/sejarah")

    from .routes import profil_yayasan_struktur_routes
    app.register_blueprint(profil_yayasan_struktur_routes.bp, url_prefix="/api/profil_yayasan/struktur")

    from .routes import profil_yayasan_kemitraan_routes
    app.register_blueprint(profil_yayasan_kemitraan_routes.bp, url_prefix="/api/profil_yayasan/kemitraan")

    from .routes import profil_yayasan_kemitraan_item_routes
    app.register_blueprint(profil_yayasan_kemitraan_item_routes.bp, url_prefix="/api/profil_yayasan/kemitraan-item")

    from .routes import profil_yayasan_keluarga_besar_routes
    app.register_blueprint(profil_yayasan_keluarga_besar_routes.bp, url_prefix="/api/profil_yayasan/keluarga-besar")

    from .routes import profil_yayasan_prestasi_routes
    app.register_blueprint(profil_yayasan_prestasi_routes.bp, url_prefix="/api/profil_yayasan/prestasi")

    from .routes import profil_yayasan_prestasi_item_routes
    app.register_blueprint(profil_yayasan_prestasi_item_routes.bp, url_prefix="/api/profil_yayasan/prestasi-item")

    from .routes import profil_yayasan_program_unggulan_routes
    app.register_blueprint(profil_yayasan_program_unggulan_routes.bp, url_prefix="/api/profil_yayasan/program-unggulan")

    from .routes import pendaftaran_siswa_baru_routes
    app.register_blueprint(pendaftaran_siswa_baru_routes.bp, url_prefix="/api/pendaftaran_siswa_baru")

    from .routes import informasi_berita_routes
    app.register_blueprint(informasi_berita_routes.bp, url_prefix="/api/informasi_berita")

    from .routes import majalah_digital_routes
    app.register_blueprint(majalah_digital_routes.bp, url_prefix="/api/majalah_digital")

    from .routes import kolom_guru_routes
    app.register_blueprint(kolom_guru_routes.bp, url_prefix="/api/kolom_guru")

    from .routes import kolom_siswa_routes
    app.register_blueprint(kolom_siswa_routes.bp, url_prefix="/api/kolom_siswa")

    from .routes import kolom_alumni_routes
    app.register_blueprint(kolom_alumni_routes.bp, url_prefix="/api/kolom_alumni")

    from .routes import fasilitas_section_routes
    app.register_blueprint(fasilitas_section_routes.bp, url_prefix="/api/fasilitas_section")

    from .routes import fasilitas_item_routes
    app.register_blueprint(fasilitas_item_routes.bp, url_prefix="/api/fasilitas_item")

    from .routes import contact_routes
    app.register_blueprint(contact_routes.bp, url_prefix="/api/contact")

    from .routes import profil_yayasan_program_kerja_routes
    app.register_blueprint(profil_yayasan_program_kerja_routes.bp, url_prefix="/api/program-kerja")

    from .routes import hubungi_kami_routes
    app.register_blueprint(hubungi_kami_routes.bp, url_prefix="/api/hubungi_kami")

    from .routes import komite_pomg_routes
    app.register_blueprint(komite_pomg_routes.bp, url_prefix="/api/komite-pomg")

    from .routes import banner_tkit_routes
    app.register_blueprint(banner_tkit_routes.bp, url_prefix="/api/banner_tkit")

    from .routes import banner_tkit_2_routes
    app.register_blueprint(banner_tkit_2_routes.bp, url_prefix="/api/banner_tkit_2")

    from .routes import banner_sdit_routes
    app.register_blueprint(banner_sdit_routes.bp, url_prefix="/api/banner_sdit")

    from .routes import banner_smpit_routes
    app.register_blueprint(banner_smpit_routes.bp, url_prefix="/api/banner_smpit")

    from .routes import banner_smait_routes
    app.register_blueprint(banner_smait_routes.bp, url_prefix="/api/banner_smait")

    from .routes import banner_smkit_routes
    app.register_blueprint(banner_smkit_routes.bp, url_prefix="/api/banner_smkit")

    from .routes import materi_ajar_routes
    app.register_blueprint(materi_ajar_routes.bp, url_prefix="/api/materi_ajar")

    from .routes import visi_misi_tujuan_tkit_1_routes
    app.register_blueprint(visi_misi_tujuan_tkit_1_routes.bp, url_prefix="/api/visi_misi_tujuan_tkit_1")

    from .routes import struktur_organisasi_tkit1_routes
    app.register_blueprint(struktur_organisasi_tkit1_routes.bp, url_prefix="/api/struktur_organisasi_tkit1")

    from .routes import visi_misi_sasaran_tkit2_routes
    app.register_blueprint(visi_misi_sasaran_tkit2_routes.bp, url_prefix="/api/visi_misi_sasaran_tkit2")
 
    from .routes import kegiatan_pembelajaran_tkit2_routes
    app.register_blueprint(kegiatan_pembelajaran_tkit2_routes.bp, url_prefix="/api/kegiatan_pembelajaran_tkit2")    

    from .routes import program_unggulan_tkit2_routes
    app.register_blueprint(program_unggulan_tkit2_routes.bp, url_prefix="/api/program_unggulan_tkit_2")

    from .routes import struktur_organisasi_tkit2_routes
    app.register_blueprint(struktur_organisasi_tkit2_routes.bp, url_prefix="/api/struktur_organisasi_tkit2")

    from .routes import visi_misi_sasaran_sdit_routes
    app.register_blueprint(visi_misi_sasaran_sdit_routes.bp, url_prefix="/api/visi_misi_sasaran_sdit")

    from .routes import kurikulum_sdit_routes
    app.register_blueprint(kurikulum_sdit_routes.bp, url_prefix="/api/kurikulum_sdit")

    from .routes import program_unggulan_sdit_routes
    app.register_blueprint(program_unggulan_sdit_routes.bp, url_prefix="/api/program_unggulan_sdit")

    from .routes import struktur_organisasi_sdit_routes
    app.register_blueprint(struktur_organisasi_sdit_routes.bp, url_prefix="/api/struktur_organisasi_sdit")

    from .routes import prestasi_sdit_routes
    app.register_blueprint(prestasi_sdit_routes.bp, url_prefix="/api/prestasi_sdit")

    from .routes import visi_misi_sasaran_smpit_routes
    app.register_blueprint(visi_misi_sasaran_smpit_routes.bp, url_prefix="/api/visi-misi-sasaran-smpit")

    from .routes import struktur_organisasi_smpit_routes
    app.register_blueprint(struktur_organisasi_smpit_routes.bp, url_prefix="/api/struktur-organisasi-smpit")

    from .routes import prestasi_smpit_routes
    app.register_blueprint(prestasi_smpit_routes.bp, url_prefix="/api/prestasi-smpit")

    from .routes import visi_misi_sasaran_smait_routes
    app.register_blueprint(visi_misi_sasaran_smait_routes.bp, url_prefix="/api/visi-misi-sasaran-smait")

    from .routes import kurikulum_smait_routes
    app.register_blueprint(kurikulum_smait_routes.bp, url_prefix="/api/kurikulum-smait")

    from .routes import program_unggulan_smait_routes
    app.register_blueprint(program_unggulan_smait_routes.bp, url_prefix="/api/program-unggulan-smait")
    
    from .routes import staf_smait_routes
    app.register_blueprint(staf_smait_routes.bp, url_prefix="/api/staf-smait")

    from .routes import prestasi_smait_routes
    app.register_blueprint(prestasi_smait_routes.bp, url_prefix="/api/prestasi-smait")

    from .routes import visi_misi_sasaran_smkit_routes
    app.register_blueprint(visi_misi_sasaran_smkit_routes.bp, url_prefix="/api/visi-misi-sasaran-smkit")

    from .routes import program_kejuruan_smkit_routes
    app.register_blueprint(program_kejuruan_smkit_routes.bp, url_prefix="/api/program-kejuruan-smkit")

    from .routes import staf_smkit_routes
    app.register_blueprint(staf_smkit_routes.bp, url_prefix="/api/staf-smkit")

    from .routes import prestasi_smkit_routes
    app.register_blueprint(prestasi_smkit_routes.prestasi_smkit_bp, url_prefix="/api/prestasi-smkit")

    # ========================
    # Serve Uploads
    # ========================
    @app.route('/public/uploads/<filename>')
    def uploaded_file(filename):
        try:
            logger.info(f"Serving file: {filename}")
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
        except Exception as e:
            logger.error(f"Error serving file {filename}: {str(e)}")
            return error_response(f"File not found: {filename}", 404)

    # ========================
    # File Upload API
    # ========================
    @app.route('/api/upload', methods=['POST'])
    def upload_file():
        try:
            if 'file' not in request.files:
                return error_response("No file part in the request", 400)

            file = request.files['file']
            if file.filename == '':
                return error_response("No file selected", 400)

            if file and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                unique_filename = f"{uuid.uuid4().hex}.{ext}"
                upload_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(upload_path)

                file_url = f"/public/uploads/{unique_filename}"
                return success_response({"url": file_url}, "File uploaded successfully"), 201
            else:
                return error_response("File type not allowed. Only PNG, JPG, JPEG, and PDF are supported", 400)
        except Exception as e:
            logger.error(f"Upload error: {str(e)}")
            return error_response(f"Failed to upload file: {str(e)}", 500)

    # ========================
    # Health Check
    # ========================
    @app.route("/")
    def health():
        return {"status": "ok", "message": "NESA Flask API Running"}

    # ========================
    # Debug Routes
    # ========================
    @app.route("/debug/routes")
    def debug_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                "endpoint": rule.endpoint,
                "methods": list(rule.methods),
                "rule": str(rule)
            })
        return success_response(routes, "Available routes")

    return app