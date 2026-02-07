from sqlalchemy import exists, select, update
from .model import UserModel
from src.utils import db


class UserRepo:
    @staticmethod
    def create(user_id: str, email: str, password: str, access_token: str) -> None:
        user = UserModel(
            id=user_id,
            email=email,
            password=password,
            access_token=access_token,
        )
        db.session.add(user)

    @staticmethod
    def get_by_id(user_id: str) -> UserModel | None:
        return db.session.scalar(select(UserModel).where(UserModel.id == user_id))

    @staticmethod
    def get_by_email(email: str) -> UserModel | None:
        return db.session.scalar(select(UserModel).where(UserModel.email == email))

    @staticmethod
    def exists_by_email(email: str) -> bool:
        is_exists = db.session.scalar(select(exists().where(UserModel.email == email)))
        return (is_exists is not None) and is_exists

    @staticmethod
    def update_access_token(user_id: str, access_token: str) -> None:
        db.session.execute(
            update(UserModel)
            .where(UserModel.id == user_id)
            .values(access_token=access_token)
        )
