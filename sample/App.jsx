import React, { useState } from 'react';
import FileUpload from './src/components/UploadArea';
import ReviewOutput from './src/components/ReviewOutput';

const App = () => {
  const [review, setReview] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🧠 AI Code Review Agent</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <FileUpload onReview={setReview} />
        <ReviewOutput review={review} />
      </div>
    </div>
  );
};

export default App;
