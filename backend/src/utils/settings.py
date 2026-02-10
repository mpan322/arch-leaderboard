from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., init=False)
    JWT_SECRET: SecretStr = Field(..., init=False)
    JWT_EXPIRES_IN_MIN: int = 1000 * 60

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


SETTINGS = Settings()
