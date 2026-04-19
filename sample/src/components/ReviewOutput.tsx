import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ReviewOutput = ({ review }) => {
  if (!review) return null;

  return (
    <div className="mt-6 p-4 border rounded-xl bg-gray-50 shadow">
      <h2 className="text-xl font-semibold mb-3">AI Code Review:</h2>
      <SyntaxHighlighter language="markdown" style={oneDark}>
        {review}
      </SyntaxHighlighter>
    </div>
  );
};

export default ReviewOutput;
