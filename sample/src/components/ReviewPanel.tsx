import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ReviewResult {
  id: number;
  severity: "error" | "warning" | "info";
  message: string;
  line: number;
}

interface ReviewPanelProps {
  code: string;
  reviewResults: ReviewResult[];
}

export function ReviewPanel({ code, reviewResults }: ReviewPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="text-red-600" size={20} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case "info":
      default:
        return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-4">AI Code Review Results</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow bg-gray-900 rounded-lg overflow-auto max-h-[500px]">
          <SyntaxHighlighter language="javascript" style={oneDark} wrapLongLines>
            {code}
          </SyntaxHighlighter>
        </div>

        <div className="w-full md:w-96 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg overflow-auto max-h-[500px]">
          <h3 className="text-xl font-semibold mb-2">Issues Found</h3>

          {reviewResults.length === 0 && <p>No issues found!</p>}

          {reviewResults.map(({ id, severity, message, line }) => (
            <div
              key={id}
              className={`flex items-center gap-3 p-3 rounded mb-3 border-l-4 ${
                severity === "error"
                  ? "border-red-600 bg-red-100 dark:bg-red-900"
                  : severity === "warning"
                  ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900"
                  : "border-green-600 bg-green-100 dark:bg-green-900"
              }`}
            >
              {getSeverityIcon(severity)}
              <div>
                <p className="font-semibold">{message}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Line {line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
