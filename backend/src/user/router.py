from apiflask import APIBlueprint
from src.auth import get_user_dto
from src.auth.guard import verify_auth_guard

from .dto import UserDto

user_bp = APIBlueprint("user", __name__, url_prefix="/user")


@user_bp.get("/")
@user_bp.output(UserDto, 200)
@verify_auth_guard
def get_current_user():
    return get_user_dto().model_dump()
