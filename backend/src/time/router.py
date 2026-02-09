from apiflask import APIBlueprint

from src.auth.guard import auth_guard, get_user_dto
from src.time.service import TimeService
from .dto import RecordTimeReqDto, GetTimesResDto, TimeDto

time_bp = APIBlueprint("time", __name__, url_prefix="/time")


@time_bp.post("/record")
@time_bp.input(RecordTimeReqDto)
@time_bp.output(TimeDto, 201)
@auth_guard
def record(json_data: RecordTimeReqDto):
    user = get_user_dto()
    return TimeService.record(user.id, json_data).model_dump()


@time_bp.get("/")
@time_bp.output(GetTimesResDto, 200)
def get_all():
    return TimeService.get_all().model_dump()
