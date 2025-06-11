export async function reviewCode({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename: string;
}) {
  const response = await fetch("/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, filename }),
  });

  if (!response.ok) {
    console.error("Failed to review code", response.statusText);
    throw new Error("Failed to review code");
  }

  const data = await response.json();

  if (!data.summary || !Array.isArray(data.issues)) {
    return {
      filename,
      review: "",
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        suggestions: 0,
        overallScore: 0,
      },
      issues: [],
    };
  }

  return {
    filename,
    review: data.review ?? "",
    summary: data.summary,
    issues: data.issues,
  };
}
