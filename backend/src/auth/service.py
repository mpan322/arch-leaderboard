from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from apiflask import abort
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from pydantic import BaseModel

from src.user.dto import ApiKeyDto, UserDto
from src.user.model import UserModel
from src.user.repo import UserRepo
from src.utils import generate_otp
from src.utils.email import send_email
from src.utils.settings import SETTINGS

from .dto import LoginDto, SignupDto, VerifyDto


class JWTPayload(BaseModel):
    sub: str
    iat: datetime
    exp: datetime


JWT_SECRET = SETTINGS.JWT_SECRET.get_secret_value()
JWT_EXPIRES_IN_MIN = SETTINGS.JWT_EXPIRES_IN_MIN


class AuthService:
    pswd_hasher = PasswordHasher()

    @staticmethod
    def login(dto: LoginDto) -> tuple[UserDto, str]:
        # get the user
        user = UserRepo.get_by_email(dto.email)
        if user is None:
            abort(401, "incorrect email or password")
        user_res = UserDto.model_validate(user)

        # check the password
        password = dto.password.get_secret_value()
        try:
            AuthService.pswd_hasher.verify(user.password, password)
        except VerifyMismatchError:
            abort(401, "incorrect email or password")

        # generate the access token and update in database
        access_token = AuthService.__generate_access(str(user.id))

        return (user_res, access_token)

    @staticmethod
    def signup(dto: SignupDto) -> tuple[UserDto, str]:
        # get the user
        is_exists = UserRepo.exists_by_email(dto.email)
        if is_exists:
            abort(409, "email already in use")

        # hash the password
        password = dto.password.get_secret_value()
        pswd_hash = AuthService.pswd_hasher.hash(password)

        # generate the access token and otp
        user_id = str(uuid4())
        access_token = AuthService.__generate_access(user_id)
        otp = generate_otp()

        # create and get the new user
        UserRepo.create(user_id, dto.email, pswd_hash, otp)
        user = UserRepo.get_by_id(user_id)
        if user is None:
            abort(500, "signup implementation error")
        user_res = UserDto.model_validate(user)

        send_email(user.email, "Arch Leaderboard Account Verficiation", f"OTP: {otp}")

        return (user_res, access_token)

    @staticmethod
    def verify_account(user_id: str, otp: str, verify: VerifyDto) -> None:
        if otp != verify.otp:
            abort(400, "incorrect token")
        UserRepo.verify(user_id)

    @staticmethod
    def send_new_otp(user: UserDto) -> None:
        otp = generate_otp()
        UserRepo.set_new_otp(user.id, otp)
        send_email(user.email, "Arch Leaderboard Account Verficiation", f"OTP: {otp}")

    @staticmethod
    def create_api_key(user: UserDto) -> ApiKeyDto:
        api_key = "ARCH_" + str(uuid4())
        UserRepo.set_api_key(user.id, api_key)
        return ApiKeyDto(api_key=api_key)

    @staticmethod
    def token_access(access_token: str) -> UserModel:
        user_id = AuthService.__decode_access(access_token)
        user = UserRepo.get_by_id(user_id)
        if user is None:
            abort(401, "unauthorized")
        return user

    @staticmethod
    def api_key_access(api_key: str) -> UserModel:
        user = UserRepo.get_by_api_key(api_key)
        if user is None:
            abort(401, "unauthorized")
        return user

    @staticmethod
    def __generate_access(user_id: str) -> str:
        payload = JWTPayload(
            sub=user_id,
            iat=datetime.now(timezone.utc),
            exp=datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRES_IN_MIN),
        )
        return jwt.encode(payload.model_dump(), JWT_SECRET)

    @staticmethod
    def __decode_access(access_token: str) -> str:
        payload = JWTPayload.model_validate(
            jwt.decode(access_token, JWT_SECRET, algorithms=["HS256"])
        )
        return payload.sub
