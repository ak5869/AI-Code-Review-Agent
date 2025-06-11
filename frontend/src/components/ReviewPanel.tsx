import React, { useEffect, useState } from "react";
import {
  FileText, AlertTriangle, Info, Zap,
  TrendingUp, Code as CodeIcon, Shield,
  Copy, ExternalLink, CheckCircle
} from "lucide-react";

interface CodeIssue {
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

interface ReviewSummary {
  totalIssues: number;
  criticalIssues: number;
  suggestions: number;
  overallScore: number;
}

interface ReviewResult {
  filename: string;
  review: string;
  issues: CodeIssue[];
  summary: ReviewSummary;
}

interface ReviewPanelProps {
  reviewId?: number;
  data?: ReviewResult;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ reviewId, data }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [copiedIssue, setCopiedIssue] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ReviewResult | undefined>(data);

  useEffect(() => {
    if (!data && reviewId !== undefined) {
      fetch(`http://localhost:8000/history/${reviewId}`)
        .then((res) => res.json())
        .then((res) => {
          setReviewData({
            filename: res.filename,
            review: res.review_summary,
            issues: JSON.parse(res.issues),
            summary: {
              totalIssues: JSON.parse(res.issues).length,
              criticalIssues: JSON.parse(res.issues).filter((i: any) => i.severity === "high").length,
              suggestions: JSON.parse(res.issues).filter((i: any) => i.type === "suggestion").length,
              overallScore: 100 - JSON.parse(res.issues).length * 3,
            },
          });
        })
        .catch(console.error);
    }
  }, [data, reviewId]);

  if (!reviewData || !reviewData.summary || !Array.isArray(reviewData.issues)) {
    return (
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">No review data available</h2>
        <p className="text-gray-600">Please upload and review code first.</p>
      </div>
    );
  }

  const toggle = (id: string) => {
    const s = new Set(expandedIssues);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedIssues(s);
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIssue(id);
    setTimeout(() => setCopiedIssue(null), 1500);
  };

  const typeIcon = (t: string) => {
    const map = {
      error: <AlertTriangle className="w-4 h-4 text-red-500" />,
      warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      info: <Info className="w-4 h-4 text-blue-500" />,
      suggestion: <Zap className="w-4 h-4 text-purple-500" />,
    } as const;
    return map[t as keyof typeof map] ?? <Info />;
  };

  const categoryIcon = (c: string) => {
    const map: Record<string, JSX.Element> = {
      security: <Shield className="w-4 h-4 text-red-500" />,
      performance: <TrendingUp className="w-4 h-4 text-green-500" />,
      maintainability: <CodeIcon className="w-4 h-4 text-blue-500" />,
      style: <FileText className="w-4 h-4 text-purple-500" />,
      bug: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    };
    return map[c] ?? <Info />;
  };

  const badge = (sev: string) => {
    const map: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${map[sev] ?? ""}`;
  };

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-600" :
    score >= 60 ? "text-yellow-600" :
    "text-red-600";

  const { summary, issues } = reviewData;

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">{reviewData.filename}</h2>

      {reviewData.review && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">AI Review Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">{reviewData.review}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Overall Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(summary.overallScore)}`}>
            {summary.overallScore}/100
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Issues</p>
          <p className="text-2xl font-bold">{summary.totalIssues}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Critical Issues</p>
          <p className="text-2xl font-bold">{summary.criticalIssues}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Suggestions</p>
          <p className="text-2xl font-bold">{summary.suggestions}</p>
        </div>
      </div>

      <div className="space-y-4">
        {issues.map(issue => (
          <div key={issue.id} className="border rounded overflow-hidden shadow-sm bg-white">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => toggle(issue.id)}
            >
              <div className="flex items-center space-x-2">
                {typeIcon(issue.type)}
                {categoryIcon(issue.category)}
                <div>
                  <h4 className="font-medium">{issue.title}</h4>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                  <p className="text-xs text-gray-500">
                    Line {issue.line}:{issue.column}
                  </p>
                </div>
              </div>
              <span className={`ml-2 ${badge(issue.severity)}`}>{issue.severity}</span>
            </div>

            {expandedIssues.has(issue.id) && (
              <div className="p-4 bg-gray-50 space-y-3">
                <div>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded relative overflow-x-auto">
                    <code>{issue.code}</code>
                    <button
                      onClick={() => copy(issue.code, issue.id)}
                      className="absolute top-2 right-2 text-gray-400"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedIssue === issue.id && (
                      <span className="absolute top-2 right-8 text-green-500 text-xs">Copied</span>
                    )}
                  </pre>
                </div>
                <div>
                  <p className="font-medium">Suggested Fix:</p>
                  <p className="text-green-700">{issue.suggestion}</p>
                </div>
                <div className="flex space-x-2 text-sm">
                  <button className="flex items-center px-3 py-1 bg-blue-100 rounded">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Learn More
                  </button>
                  <button className="flex items-center px-3 py-1 bg-gray-100 rounded">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark as Fixed
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPanel;
