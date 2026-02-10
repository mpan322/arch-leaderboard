from uuid import uuid4

from flask import abort

from src.time.dto import GetTimesResDto, RecordTimeReqDto, TimeDto
from src.time.repo import TimeRepo


class TimeService:
    @staticmethod
    def record(user_id: str, record: RecordTimeReqDto) -> TimeDto:
        time_id = str(uuid4())
        TimeRepo.create(time_id, user_id, record)
        time = TimeRepo.get_by_id(time_id)
        if time is None:
            abort(500, "bad record implementation")
        print(time)
        return TimeDto.model_validate(time)

    @staticmethod
    def get_all() -> GetTimesResDto:
        times = TimeRepo.get_all()
        return GetTimesResDto.model_validate({"times": times})
