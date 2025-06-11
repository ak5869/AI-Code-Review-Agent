from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import json
from dotenv import load_dotenv
from database import init_db, insert_review, get_all_reviews, DB_PATH
import re
import sqlite3
from pathlib import Path
from typing import List, Optional

load_dotenv()
init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Issue(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: str
    line: int
    column: int
    code: str
    suggestion: str
    category: str

class Summary(BaseModel):
    totalIssues: int
    criticalIssues: int
    suggestions: int
    overallScore: int

class ReviewResult(BaseModel):
    filename: str
    review: str
    issues: List[Issue]
    summary: Summary

class ReviewRequest(BaseModel):
    code: str
    language: str
    filename: str

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/review")
async def review_code(request: ReviewRequest):
    prompt = f"""
You are an expert code reviewer. Analyze the following {request.language} code.

Return the result strictly in the following JSON format:
{{
"review": "Short overall summary",
"issues": [
    {{
    "id": "unique-id",
    "type": "error | warning | suggestion | info",
    "severity": "high | medium | low",
    "title": "Brief issue title",
    "description": "Detailed explanation of the issue",
    "line": 1,
    "column": 0,
    "code": "code snippet",
    "suggestion": "How to fix or improve",
    "category": "bug | performance | maintainability | style | security"
    }}
],
"summary": {{
    "totalIssues": number,
    "criticalIssues": number,
    "suggestions": number,
    "overallScore": number (0 to 100)
}}
}}

Code:
{request.code}
"""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {"role": "system", "content": "You are a JSON-only expert code reviewer."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
        )

    try:
        result = response.json()
        content = result["choices"][0]["message"]["content"]

        content = re.sub(r"^```(?:json)?", "", content.strip(), flags=re.IGNORECASE)
        content = re.sub(r"```$", "", content.strip())

        content = content.replace(",\n}", "\n}").replace(",\n]", "\n]")

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as json_err:
            print("Final LLM Raw Content:\n", content)
            raise json_err

        insert_review(
            filename=request.filename,
            review_summary=parsed.get("review", ""),
            issues=json.dumps(parsed.get("issues", [])),
            status="completed"
        )

        return {
            "filename": request.filename,
            "review": parsed.get("review", ""),
            "issues": parsed.get("issues", []),
            "summary": parsed.get("summary", {
                "totalIssues": 0,
                "criticalIssues": 0,
                "suggestions": 0,
                "overallScore": 0
            })
        }

    except Exception as e:
        print("Parsing error:", e)
        return {
            "filename": request.filename,
            "review": "Failed to parse LLM output.",
            "issues": [],
            "summary": {
                "totalIssues": 0,
                "criticalIssues": 0,
                "suggestions": 0,
                "overallScore": 0
            }
        }

@app.get("/history")
def fetch_review_history():
    reviews = get_all_reviews()
    return {
        "history": [
            {
                "id": r[0],
                "filename": r[1],
                "review_summary": r[2],
                "issues": json.loads(r[3]),
                "review_date": r[4],
                "status": r[5]
            }
            for r in reviews
        ]
    }

@app.post("/insert")
async def insert_review_entry(request: Request):
    body = await request.json()
    insert_review(
        filename=body["filename"],
        review_summary=body["review_summary"],
        issues=body["issues"],
        status=body.get("status", "completed")
    )
    return {"message": "Inserted successfully"}

@app.get("/history/{review_id}")
async def get_review_detail(review_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM reviews WHERE id = ?', (review_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Review not found")

    review = {
        "id": row[0],
        "filename": row[1],
        "review_summary": row[2],
        "issues": row[3],
        "review_date": row[4],
        "status": row[5]
    }
    return review

@app.post("/save_review")
async def save_review(data: ReviewResult):
    insert_review(
        filename=data.filename,
        review_summary=data.review,
        issues=json.dumps([issue.dict() for issue in data.issues]),
        status="completed"
    )
    return {"status": "success"}
