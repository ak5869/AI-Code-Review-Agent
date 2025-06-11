from fastapi import APIRouter
from models.schema import ReviewRequest
from services.analyzer import analyze_code

router = APIRouter()

@router.post("/review", response_model=dict)
async def review_code(req: ReviewRequest):
    result = analyze_code(req.code, req.language, req.filename)
    return result.dict()
