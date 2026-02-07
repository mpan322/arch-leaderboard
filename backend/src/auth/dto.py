from pydantic import BaseModel, EmailStr, Field, SecretStr, field_validator
import re


class SignupDto(BaseModel):
    email: EmailStr
    password: SecretStr = Field(..., min_length=6)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: SecretStr) -> SecretStr:
        password = v.get_secret_value()

        # Complexity checks
        if not any(c.isupper() for c in password):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in password):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(c.isdigit() for c in password):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain at least one special character.")

        return v


class LoginDto(BaseModel):
    email: EmailStr
    password: SecretStr
