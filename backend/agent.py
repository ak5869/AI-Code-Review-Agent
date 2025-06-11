from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv
import os
import json

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable not found")

# Structured prompt for code review
template = """
You are an expert software engineer and code reviewer. Carefully analyze the following {language} code.

Return your analysis in the following strict JSON format:

{{
  "review": "string (short summary of overall issues)",
  "issues": [
    {{
      "id": "unique-id",
      "type": "error | warning | suggestion | info",
      "severity": "high | medium | low",
      "title": "short title",
      "description": "detailed description of the issue",
      "line": line number (if known, else 0),
      "column": column number (if known, else 0),
      "code": "offending code snippet",
      "suggestion": "fix or improvement",
      "category": "bug | performance | maintainability | style | security"
    }}
  ],
  "summary": {{
    "totalIssues": number,
    "criticalIssues": number,
    "suggestions": number,
    "overallScore": number (out of 100)
  }}
}}

Code:
{code}
"""

prompt = PromptTemplate(
    input_variables=["code", "language"],
    template=template,
)

llm = ChatGroq(
    model_name="mixtral-8x7b-32768",  # or "gemma-7b-it" or any Groq-supported model
    groq_api_key=api_key,
    temperature=0.2,
)

code_review_chain = prompt | llm

def review_code(code: str, language: str = "Python") -> dict:
    try:
        result = code_review_chain.invoke({"code": code, "language": language})
        parsed = json.loads(result)
        return parsed
    except json.JSONDecodeError as e:
        print("Failed to parse LLM response as JSON:", result)
        raise e
    except Exception as e:
        print("Review failed:", e)
        raise e
