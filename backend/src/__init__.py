from apiflask import APIFlask

from src.utils.settings import SETTINGS
from .user import user_bp
from .auth import auth_bp
from .time import time_bp
from .utils import db, heartbeat_bp
from sqlalchemy import event
from sqlalchemy.engine import Engine
from flask_cors import CORS


def create_app():
    print("[APP SETTINGS]", SETTINGS)
    app = APIFlask(__name__, title="arch-leader", version="0.1.0")
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = SETTINGS.DATABASE_URL
    app.config["DEBUG"] = SETTINGS.DEBUG

    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(time_bp)
    app.register_blueprint(heartbeat_bp)
    register_secutiry(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    return app


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def register_secutiry(app: APIFlask):
    app.security_schemes = {
        "CookieAuth": {
            "type": "apiKey",
            "in": "cookie",
            "name": "access_token",
        }
    }
