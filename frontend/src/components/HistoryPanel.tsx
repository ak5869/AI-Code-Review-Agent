import React, { useEffect, useState } from 'react';
import { Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface CodeIssue {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  line: number;
  column: number;
  code: string;
  suggestion: string;
  category: string;
}

interface ReviewEntry {
  id: string;
  filename: string;
  reviewDate: string;
  reviewSummary: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: CodeIssue[];
}

const HistoryPanel: React.FC = () => {
  const [reviewEntries, setReviewEntries] = useState<ReviewEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/history");
        const data = await res.json();

        const mapped: ReviewEntry[] = data.history.map((entry: any) => ({
          id: entry.id.toString(),
          filename: entry.filename,
          reviewDate: entry.review_date,
          reviewSummary: entry.review_summary,
          status: entry.status,
          issues: entry.issues,
        }));

        setReviewEntries(mapped);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
  }, []);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    const map: Record<string,string> = {
      completed: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
      'in-progress': "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
      failed: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    };
    return `${base} ${map[status]||""}`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US',{month:'short', day:'numeric', year:'numeric'});

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Review History</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your code review progress and results</p>
      </div>

      <div className="space-y-4">
        {reviewEntries.map(entry => {
          // compute summary metrics
          const totalIssues = entry.issues.length;
          const criticalIssues = entry.issues.filter(i => i.severity === 'high').length;
          const suggestions = entry.issues.filter(i => i.type === 'suggestion').length;
          const overallScore = entry.issues.length
            ? Math.round(((totalIssues - criticalIssues) / totalIssues) * 100)
            : 100;

          return (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200 cursor-pointer"
              onClick={() => toggle(entry.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{entry.filename}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.reviewDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(entry.status)}>{entry.status.replace('-', ' ')}</span>
                  {getStatusIcon(entry.status)}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{entry.reviewSummary}</p>

              {expandedId === entry.id && (
                <div className="mt-4 space-y-6">
                  {/* Summary metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Issues</p>
                      <p className="text-2xl font-bold">{totalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Critical Issues</p>
                      <p className="text-2xl font-bold">{criticalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Suggestions</p>
                      <p className="text-2xl font-bold">{suggestions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="text-2xl font-bold">{overallScore}%</p>
                    </div>
                  </div>
                  {/* Issues list */}
                  <div>
                    <h4 className="font-medium mb-2">Issues Details:</h4>
                    <ul className="space-y-4">
                      {entry.issues.map(issue => (
                        <li key={issue.id} className="border rounded p-3 bg-gray-50 dark:bg-gray-700">
                          <div className="flex justify-between">
                            <h5 className="font-semibold">{issue.title}</h5>
                            <span className={getStatusBadge(issue.severity)}>{issue.severity}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{issue.description}</p>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded mb-2 overflow-auto">{issue.code}</pre>
                          <p className="text-sm"><strong>Suggestion:</strong> {issue.suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;
