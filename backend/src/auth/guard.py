from functools import wraps
from apiflask import abort
from flask import g
from src.auth.jwt import get_access_token
from src.auth.service import AuthService
from src.user.dto import UserDto


def auth_guard(f):
    if not hasattr(f, "_spec"):
        f._spec = {}
    if not hasattr(f._spec, "security"):
        f._spec["security"] = []
    f._spec["security"].append({"CookieAuth": []})

    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_cookie = get_access_token()
        if jwt_cookie is None:
            abort(401, "unauthorized")

        user = AuthService.access(jwt_cookie)
        g.user = user

        return f(*args, **kwargs)

    return decorated_function


def get_user() -> UserDto:
    return g.user
