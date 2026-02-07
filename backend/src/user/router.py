from apiflask import APIBlueprint
from src.auth import auth_guard, get_user

from .dto import UserDto

user_bp = APIBlueprint("user", __name__, url_prefix="/user")


@user_bp.get("/")
@user_bp.output(UserDto, 200)
@auth_guard
def get_current_user():
    return get_user().model_dump()
