from flask import abort
from .repo import UserRepo
from .dto import UserDto
from src.utils import db


class UserService:
    @staticmethod
    def get_by_id(user_id: str) -> UserDto:
        with db.session.begin():
            user = UserRepo.get_by_id(user_id)
            if user is None:
                abort(404, "user not found")
            return UserDto.model_validate(user)
