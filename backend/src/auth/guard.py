from functools import wraps
from apiflask import abort
from flask import g, request
from src.auth.jwt import get_access_token
from src.auth.service import AuthService
from src.user.dto import UserDto


def try_jwt() -> UserDto | None:
    jwt_token = get_access_token()
    if jwt_token is None:
        return None
    return AuthService.token_access(jwt_token)


def try_bearer() -> UserDto | None:
    auth_header = request.headers.get("Authorization")
    if auth_header is None:
        return None

    auth = auth_header.split(" ")
    if len(auth) != 2 or auth[0] != "Bearer":
        return None
    api_key = auth[1]

    return AuthService.api_key_access(api_key)


def auth_guard(f):
    if not hasattr(f, "_spec"):
        f._spec = {}
    if not hasattr(f._spec, "security"):
        f._spec["security"] = []
    f._spec["security"].append({"CookieAuth": [], "BearerAuth": []})

    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = try_jwt()
        if user is not None:
            g.user = user
            return f(*args, **kwargs)

        user = try_bearer()
        if user is not None:
            g.user = user
            return f(*args, **kwargs)

        abort(401, "unauthorized")

    return decorated_function


def get_user() -> UserDto:
    return g.user
