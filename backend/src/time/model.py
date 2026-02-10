from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, func
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
    language: Mapped[str]
    timestamp: Mapped[datetime] = mapped_column(server_default=func.now(), init=False)

    posted_by: Mapped[str] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    poster: Mapped["UserModel"] = relationship(back_populates="times", init=False)
