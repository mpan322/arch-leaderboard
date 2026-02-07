from pydantic import BaseModel, EmailStr, ConfigDict


class UserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
