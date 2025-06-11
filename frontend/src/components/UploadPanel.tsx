import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { reviewCode } from '../libs/openai';
import type { ReviewResult } from '../types';

type UploadPanelProps = {
  onReviewComplete: (data: ReviewResult) => void;
};

const MAX_FILES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const UploadPanel: React.FC<UploadPanelProps> = ({ onReviewComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const addFiles = (newFiles: File[]) => {
  const filtered = newFiles
    .filter(file => file.size <= MAX_FILE_SIZE)
    .filter(file => !files.some(f => f.name === file.name)); // Prevent duplicates

  if (files.length + filtered.length > MAX_FILES) {
    alert(`Max ${MAX_FILES} files allowed`);
    return;
  }

  setFiles(prev => [...prev, ...filtered]);
};


  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const detectLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      js: 'javascript', ts: 'typescript', py: 'python', java: 'java',
      cpp: 'cpp', c: 'c', cs: 'csharp', php: 'php', rb: 'ruby',
      go: 'go', rs: 'rust', swift: 'swift', kt: 'kotlin',
    };
    return map[ext || ''] || 'plaintext';
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const file = files[0]; // For now, handle only the first file
      const text = await file.text();
      const result = await reviewCode({
        code: text,
        language: detectLanguage(file.name),
        filename: file.name,
      });

      // Fallback structure if API result is missing keys
      if (!result.summary || !Array.isArray(result.issues)) {
        result.summary = {
          totalIssues: 0,
          criticalIssues: 0,
          suggestions: 0,
          overallScore: 0,
        };
        result.issues = [];
      }

      // Send result to parent component (App)
      onReviewComplete(result);
    } catch (error: any) {
      console.error("UploadPanel Error:", error);
      alert("An error occurred while reviewing the code.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Upload Code</h2>
      <p className="text-gray-600 mb-4">Upload files for AI-powered code review.</p>

      <div
        className={`border-2 border-dashed rounded-xl p-8 mb-6 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} className="hidden" />
        <div className="text-center">
          <Upload className="w-10 h-10 mx-auto text-blue-500 mb-3" />
          <p>Drop files here or click to upload</p>
          <button onClick={() => fileInputRef.current?.click()} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
            Choose Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files</h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{file.name}</span>
                <button onClick={() => removeFile(idx)} className="text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`px-6 py-2 rounded text-white ${
              uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {uploading ? (
              <div className='flex items-centerspace-x-2'>
                <div className='loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Reviewing...</span>
              </div>
            ) : (
              "Start Review"
          )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
