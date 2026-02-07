from typing import Sequence
from sqlalchemy import select

from .dto import RecordTimeReqDto
from .model import TimeModel
from src.utils import db


class TimeRepo:
    @staticmethod
    def create(time_id: str, user_id: str, dto: RecordTimeReqDto) -> None:
        time = TimeModel(
            id=time_id,
            posted_by=user_id,
            output_json=dto.output_json,
            validated=False,
            cache_file=dto.cache_file,
            trace_file=dto.trace_file,
            millis=dto.millis,
            language=dto.language,
        )
        db.session.add(time)

    @staticmethod
    def get_by_id(time_id: str) -> TimeModel | None:
        return db.session.scalar(select(TimeModel).where(TimeModel.id == time_id))

    @staticmethod
    def get_all() -> Sequence[TimeModel]:
        return db.session.scalars(
            select(TimeModel).order_by(TimeModel.millis.asc())
        ).all()
