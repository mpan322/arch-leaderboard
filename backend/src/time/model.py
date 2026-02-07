from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.utils import Base

if TYPE_CHECKING:
    from src.user.model import UserModel


class TimeModel(Base):
    __tablename__ = "time"

    id: Mapped[str] = mapped_column(primary_key=True)
    millis: Mapped[int]
    cache_file: Mapped[str]
    trace_file: Mapped[str]
    validated: Mapped[bool]
    output_json: Mapped[str]

    posted_by: Mapped[str] = mapped_column(ForeignKey("user.id"), nullable=False)
    poster: Mapped["UserModel"] = relationship(back_populates="times", init=False)
