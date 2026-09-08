from html import escape, unescape
import re
from urllib.parse import quote

from flask import Blueprint, Response

from app.models import (
    berita_artikel_model,
    kolom_alumni_model,
    kolom_guru_model,
    kolom_siswa_model,
    majalah_digital_model,
)

bp = Blueprint("share_meta", __name__)

SITE_BASE_URL = "http://localhost:3000"
API_BASE_URL = "http://localhost:5001"
SITE_NAME = "SMK PKP 1 Jakarta Islamic School"
DEFAULT_TITLE = "SMK PKP 1 Jakarta Islamic School"
DEFAULT_DESCRIPTION = (
    "Sekolah Menengah Kejuruan Islam unggulan di Jakarta. Mencetak generasi muda "
    "berakhlak mulia, kompeten, dan berdaya saing global."
)
DEFAULT_IMAGE = f"{API_BASE_URL}/public/uploads/1.png"

CONTENT_CONFIG = {
    "berita": {
        "path": "/informasi/berita",
        "fetch": berita_artikel_model.get_berita_by_slug,
        "title": "judul",
        "description": ("meta_description", "deskripsi", "content_delta"),
        "image": "gambar",
    },
    "majalah": {
        "path": "/informasi/majalah",
        "fetch": majalah_digital_model.get_majalah_digital_by_slug,
        "title": "judul",
        "description": ("meta_description", "deskripsi", "content_delta"),
        "image": "cover_image",
    },
    "kolom-guru": {
        "path": "/informasi/kolom-guru",
        "fetch": kolom_guru_model.get_kolom_by_slug,
        "title": "judul",
        "description": ("meta_description", "konten", "content_delta"),
        "image": "image",
    },
    "kolom-siswa": {
        "path": "/informasi/kolom-siswa",
        "fetch": kolom_siswa_model.get_kolom_siswa_by_slug,
        "title": "judul",
        "description": ("meta_description", "konten", "content_delta"),
        "image": "gambar",
    },
    "kolom-alumni": {
        "path": "/informasi/kolom-alumni",
        "fetch": kolom_alumni_model.get_kolom_alumni_by_slug,
        "title": "judul",
        "description": ("meta_description", "isi", "content_delta"),
        "image": "gambar",
    },
}


def strip_html(value):
    if not value:
        return ""

    text = str(value)
    for _ in range(3):
        decoded = unescape(text)
        if decoded == text:
            break
        text = decoded

    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def first_text(data, fields):
    for field in fields:
        text = strip_html(data.get(field))
        if text:
            return text[:220]
    return DEFAULT_DESCRIPTION


def absolute_image_url(value):
    if not value:
        return DEFAULT_IMAGE

    image = str(value).strip()
    if image.startswith(("http://", "https://")):
        return image
    if image.startswith("/"):
        return f"{API_BASE_URL}{image}"
    return f"{API_BASE_URL}/public/uploads/{quote(image)}"


def render_meta_page(data, config, slug):
    path = f"{config['path']}/{quote(slug)}"
    canonical_url = f"{SITE_BASE_URL}{path}"
    title = strip_html(data.get(config["title"])) or DEFAULT_TITLE
    full_title = f"{title} | {SITE_NAME}" if title != DEFAULT_TITLE else title
    description = first_text(data, config["description"])
    image = absolute_image_url(data.get(config["image"]))

    html = f"""<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{escape(full_title)}</title>
    <meta name="description" content="{escape(description)}">
    <link rel="canonical" href="{escape(canonical_url)}">

    <meta property="og:type" content="article">
    <meta property="og:site_name" content="{escape(SITE_NAME)}">
    <meta property="og:url" content="{escape(canonical_url)}">
    <meta property="og:title" content="{escape(full_title)}">
    <meta property="og:description" content="{escape(description)}">
    <meta property="og:image" content="{escape(image)}">
    <meta property="og:image:secure_url" content="{escape(image)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{escape(canonical_url)}">
    <meta name="twitter:title" content="{escape(full_title)}">
    <meta name="twitter:description" content="{escape(description)}">
    <meta name="twitter:image" content="{escape(image)}">

    <script>
      if (!/bot|crawler|spider|facebookexternalhit|whatsapp|telegram|twitterbot|linkedinbot|slackbot|discordbot/i.test(navigator.userAgent)) {{
        window.location.replace("{escape(canonical_url)}");
      }}
    </script>
  </head>
  <body>
    <h1>{escape(full_title)}</h1>
    <p>{escape(description)}</p>
    <p><a href="{escape(canonical_url)}">Buka artikel</a></p>
  </body>
</html>"""
    return Response(html, mimetype="text/html")


@bp.route("/share/informasi/<content_type>/<slug>", methods=["GET"])
@bp.route("/informasi/<content_type>/<slug>", methods=["GET"])
def share_content(content_type, slug):
    config = CONTENT_CONFIG.get(content_type)
    if not config:
        return Response("Konten tidak ditemukan", status=404, mimetype="text/plain")

    data = config["fetch"](slug)
    if not data:
        return Response("Konten tidak ditemukan", status=404, mimetype="text/plain")

    return render_meta_page(data, config, slug)
