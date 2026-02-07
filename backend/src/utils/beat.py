from apiflask import APIBlueprint


heartbeat_bp = APIBlueprint("heartbeat", __name__, url_prefix="/heartbeat")


@heartbeat_bp.get("/")
def heartbeat():
    return "OK"
