// src/pages/ReviewResult.tsx
import { useParams } from 'react-router-dom';

const ReviewResult = () => {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Review Result</h2>
      <p className="text-gray-700">Review results for ID: <span className="font-mono">{id}</span></p>
    </div>
  );
};

export default ReviewResult;
