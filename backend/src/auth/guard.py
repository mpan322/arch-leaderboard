from functools import wraps
from apiflask import abort
from flask import g, request
from src.auth.jwt import get_access_token
from src.auth.service import AuthService
from src.user.dto import UserDto
from src.user.model import UserModel


def try_jwt() -> UserModel | None:
    jwt_token = get_access_token()
    if jwt_token is None:
        return None
    return AuthService.token_access(jwt_token)


def try_bearer() -> UserModel | None:
    auth_header = request.headers.get("Authorization")
    if auth_header is None:
        return None

    auth = auth_header.split(" ")
    if len(auth) != 2 or auth[0] != "Bearer":
        return None
    api_key = auth[1]

    return AuthService.api_key_access(api_key)


def verify_auth_guard(f):
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


def auth_guard(f):
    if not hasattr(f, "_spec"):
        f._spec = {}
    if not hasattr(f._spec, "security"):
        f._spec["security"] = []
    f._spec["security"].append({"CookieAuth": [], "BearerAuth": []})

    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = try_jwt()
        if user is not None and user.is_verified:
            g.user = user
            return f(*args, **kwargs)

        user = try_bearer()
        if user is not None and user.is_verified:
            g.user = user
            return f(*args, **kwargs)

        abort(401, "unauthorized")

    return decorated_function


def get_user_dto() -> UserDto:
    if g.user is None:
        abort(500, "bad implementation")
    return UserDto.model_validate(g.user)


def get_user_model() -> UserModel:
    if g.user is None:
        abort(500, "bad implementation")
    return g.user
