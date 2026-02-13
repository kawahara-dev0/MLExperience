"""Request/response models for the API."""

from enum import Enum
from pydantic import BaseModel


class FETCH_REQ(Enum):
    Import = "Import"
    Preproc = "Preproc"
    Optimize = "Optimize"
    Training = "Training"


class RequestData(BaseModel):
    req: str
    selectData: str
    arg: list[str | float | int] | None = None


class ResponseModel(BaseModel):
    res: str
    arg: list[list[str | float | int]]
