import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8000/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch review from backend." },
        { status: res.status }
      );
    }

    let data = await res.json();

    if (!data.summary || typeof data.summary !== "object") {
      data.summary = {
        totalIssues: 0,
        criticalIssues: 0,
        suggestions: 0,
        overallScore: 0,
      };
    }

    if (!Array.isArray(data.issues)) {
      data.issues = [];
    }

    if (!data.filename) {
      data.filename = body.filename || "unknown_file";
    }

    if (!data.review) {
      data.review = "";
    }

    await fetch("http://localhost:8000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: data.filename,
        review_summary: data.review,
        issues: JSON.stringify(data.issues),
        status: "completed",
      }),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API /api/review Error:", error);
    return NextResponse.json(
      { error: "An internal error occurred while processing the review." },
      { status: 500 }
    );
  }
}
