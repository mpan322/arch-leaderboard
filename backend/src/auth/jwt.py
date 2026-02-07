from flask import Response, request

ACCESS_TOKEN_COOKIE_KEY = "access_token"


def get_access_token() -> str | None:
    return request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)


def set_access_token(resp: Response, access_token: str) -> None:
    resp.set_cookie(
        ACCESS_TOKEN_COOKIE_KEY,
        access_token,
        httponly=True,
        secure=False,
    )
