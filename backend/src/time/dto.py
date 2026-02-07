from pydantic import BaseModel, ConfigDict

from src.user.dto import UserDto


class RecordTimeReqDto(BaseModel):
    millis: int
    cache_file: str
    trace_file: str
    output_json: str


class TimeDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    millis: int
    cache_file: str
    trace_file: str
    validated: bool
    output_json: str
    poster: UserDto


class GetTimesResDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    times: list[TimeDto]
