from apiflask import APIBlueprint
from flask import Response, jsonify, make_response

from src.auth.guard import auth_guard, get_user
from src.auth.jwt import set_access_token

from .service import AuthService
from .dto import LoginDto, SignupDto
from src.user.dto import ApiKeyDto, UserDto

auth_bp = APIBlueprint("auth", __name__, url_prefix="/auth")


@auth_bp.post("/login")
@auth_bp.input(LoginDto)
@auth_bp.output(UserDto, 201)
def login(json_data: LoginDto) -> Response:
    (user, access_token) = AuthService.login(json_data)

    resp = make_response(jsonify(user.model_dump()), 201)
    set_access_token(resp, access_token)
    return resp


@auth_bp.post("/signup")
@auth_bp.input(SignupDto)
@auth_bp.output(UserDto, 201)
def signup(json_data: SignupDto):
    (user, access_token) = AuthService.signup(json_data)

    resp = make_response(jsonify(user.model_dump()), 201)
    set_access_token(resp, access_token)
    return resp


@auth_bp.get("/api-key")
@auth_bp.output(ApiKeyDto, 200)
@auth_guard
def api_key():
    user = get_user()
    return AuthService.create_api_key(user).model_dump()
