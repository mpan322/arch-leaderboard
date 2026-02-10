from apiflask import APIBlueprint

from src.auth.guard import auth_guard, get_user_dto
from src.time.service import TimeService
from .dto import RecordTimeReqDto, GetTimesResDto, TimeDto
from src.utils import db

time_bp = APIBlueprint("time", __name__, url_prefix="/time")


@time_bp.post("/record")
@time_bp.input(RecordTimeReqDto)
@time_bp.output(TimeDto, 201)
@auth_guard
def record(json_data: RecordTimeReqDto):
    user = get_user_dto()
    resp = TimeService.record(user.id, json_data).model_dump()
    db.session.commit()
    return resp


@time_bp.get("/")
@time_bp.output(GetTimesResDto, 200)
def get_all():
    resp = TimeService.get_all().model_dump()
    db.session.commit()
    return resp
