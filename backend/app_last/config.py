import os
from dotenv import load_dotenv

# Load env dari file .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "bizpromy_nesweb")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "bizpromy_nesweb")
    MYSQL_DB = os.getenv("MYSQL_DB", "bizpromy_nesweb")
