import { useRef } from "react";

interface UploadAreaProps {
  code: string;
  setCode: (code: string) => void;
  runCodeReview: () => void;
}

export function UploadArea({ code, setCode, runCodeReview }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setCode(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setCode(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-4 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="mb-4">
          Drag & drop your code file here, or click to select a file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.cs,.json,.txt"
          onChange={handleFileUpload}
        />
      </div>

      {code && (
        <pre className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap max-h-96 overflow-auto font-mono text-sm">
          {code}
        </pre>
      )}

      <button
        onClick={runCodeReview}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-semibold transition"
      >
        Run Code Review
      </button>
    </div>
  );
}
