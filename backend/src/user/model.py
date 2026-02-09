from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.utils import Base

if TYPE_CHECKING:
    from src.time.model import TimeModel


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    api_key: Mapped[str | None] = mapped_column(
        unique=True, nullable=True, index=True, init=False
    )
    otp: Mapped[str] = mapped_column(init=True)
    is_verified: Mapped[bool] = mapped_column(default=False, init=False)

    times: Mapped[list["TimeModel"]] = relationship(back_populates="poster", init=False)
