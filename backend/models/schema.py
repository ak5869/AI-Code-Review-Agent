from pydantic import BaseModel

class ReviewRequest(BaseModel):
    code: str
    language: str
    filename: str

class ReviewResponse(BaseModel):
    summary: str
    refactored_code: str
