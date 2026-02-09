from pydantic import BaseModel, EmailStr, ConfigDict


class ApiKeyDto(BaseModel):
    api_key: str


class UserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    is_verified: bool
