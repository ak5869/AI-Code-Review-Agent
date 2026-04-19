import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { UploadArea } from "./components/UploadArea";
import { ReviewPanel } from "./components/ReviewPanel";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";

type Page = "upload" | "review" | "history" | "settings";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("upload");
  const [code, setCode] = useState<string>("");
  const [reviewResults, setReviewResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dummy function to simulate AI review
  const runCodeReview = () => {
    if (!code) return alert("Please upload code first!");
    setLoading(true);
    setTimeout(() => {
      setReviewResults([
        {
          id: 1,
          severity: "error",
          message: "Unused variable detected in line 12.",
          line: 12,
        },
        {
          id: 2,
          severity: "warning",
          message: "Function 'foo' has no docstring.",
          line: 8,
        },
      ]);
      setCurrentPage("review");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex flex-col flex-grow">
        <Navbar />

        <main className="p-6 flex-grow overflow-auto">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-700 h-16 w-16"></div>
            </div>
          )}

          {!loading && currentPage === "upload" && (
            <UploadArea
              code={code}
              setCode={setCode}
              runCodeReview={runCodeReview}
            />
          )}

          {!loading && currentPage === "review" && (
            <ReviewPanel code={code} reviewResults={reviewResults} />
          )}

          {!loading && currentPage === "history" && <History />}

          {!loading && currentPage === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;
