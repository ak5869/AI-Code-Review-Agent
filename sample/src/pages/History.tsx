import { useState } from "react";

interface ReviewEntry {
  id: number;
  filename: string;
  reviewDate: string;
  summary: string;
  status: "Completed" | "In Progress" | "Failed";
}

export function History() {
  // Example dummy data for now
  const [history] = useState<ReviewEntry[]>([
    {
      id: 1,
      filename: "App.tsx",
      reviewDate: "2025-06-05 14:32",
      summary: "Improved readability by refactoring functions.",
      status: "Completed",
    },
    {
      id: 2,
      filename: "ReviewPanel.tsx",
      reviewDate: "2025-06-04 10:15",
      summary: "Detected unused imports and fixed type errors.",
      status: "Completed",
    },
    {
      id: 3,
      filename: "UploadArea.tsx",
      reviewDate: "2025-06-03 08:45",
      summary: "Pending review, waiting for code upload.",
      status: "In Progress",
    },
  ]);

  // Status colors for badges
  const statusColors: Record<ReviewEntry["status"], string> = {
    Completed: "bg-green-100 text-green-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
        Review History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No review history yet.</p>
      ) : (
        <ul className="space-y-6">
          {history.map(({ id, filename, reviewDate, summary, status }) => (
            <li
              key={id}
              className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                  {filename}
                </h3>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColors[status]}`}
                >
                  {status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{summary}</p>

              <time className="text-xs text-gray-500 dark:text-gray-400">
                Reviewed on: {reviewDate}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
