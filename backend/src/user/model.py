from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.utils import Base

if TYPE_CHECKING:
    from src.time.model import TimeModel


class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    access_token: Mapped[str]

    times: Mapped[list["TimeModel"]] = relationship(back_populates="poster", init=False)
