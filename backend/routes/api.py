"""API routing: FastAPI endpoint definitions."""

from fastapi import APIRouter, HTTPException

from services.data_service import DataService
from services.training_service import TrainingService
from services.optimize_service import OptimizeService
from models.requests import RequestData, FETCH_REQ

router = APIRouter()


@router.post("/api")
def web_api(request: RequestData):
    """Handle WebAPI requests; process client request and return response."""
    target = None
    if request.arg and len(request.arg) > 0:
        target = str(request.arg[0])

    try:
        if request.req == FETCH_REQ.Import.value:
            result = DataService.import_data(request.selectData)
            return {"res": FETCH_REQ.Import.value, "arg": result}

        elif request.req == FETCH_REQ.Preproc.value:
            if not target:
                raise HTTPException(status_code=400, detail="Target is not specified")
            result = DataService.preprocess_data(request.selectData, target)
            return {"res": FETCH_REQ.Preproc.value, "arg": result}

        elif request.req == FETCH_REQ.Optimize.value:
            if not target or not request.arg or len(request.arg) < 2:
                raise HTTPException(status_code=400, detail="Required parameters are missing")
            result = OptimizeService.optimize(request.selectData, target, request.arg)
            return {"res": FETCH_REQ.Optimize.value, "arg": result}

        elif request.req == FETCH_REQ.Training.value:
            if not target or not request.arg:
                raise HTTPException(status_code=400, detail="Required parameters are missing")
            result = TrainingService.execute_training(request.selectData, target, request.arg)
            return {"res": FETCH_REQ.Training.value, "arg": result}

        else:
            return {"res": "Invalid", "arg": str(request.req)}

    except HTTPException:
        raise
    except Exception as e:
        return {"res": "error", "arg": str(e)}
