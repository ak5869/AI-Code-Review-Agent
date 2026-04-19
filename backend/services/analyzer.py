import os
import openai
from models.schema import ReviewResponse

openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_code(code: str, language: str, filename: str) -> ReviewResponse:
    prompt = f"""You are an expert programmer. Analyze the following {language} code ({filename}), and suggest improvements.
Return JSON with summary and refactored_code."""
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}, {"role": "user", "content": code}],
        temperature=0.2,
    )
    content = resp.choices[0].message.content
    try:
        data = ReviewResponse.parse_raw(content)
        return data
    except Exception:
        return ReviewResponse(summary="Failed to parse AI response", refactored_code=code)
