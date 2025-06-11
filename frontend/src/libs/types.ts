export interface CodeIssue {
  id: string;
  type: "error" | "warning" | "info" | "suggestion";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  line: number;
  column: number;
  code: string;
  suggestion: string;
  category: "security" | "performance" | "maintainability" | "style" | "bug";
}

export interface ReviewSummary {
  totalIssues: number;
  criticalIssues: number;
  suggestions: number;
  overallScore: number;
}

export interface ReviewResult {
  filename: string;
  review: string;
  issues: CodeIssue[];
  summary: ReviewSummary;
}
