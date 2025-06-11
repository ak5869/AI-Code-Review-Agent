import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import TopNavigation from './components/TopNavigation';
import Sidebar from './components/Sidebar';
import HomePanel from './components/HomePanel';
import UploadPanel from './components/UploadPanel';
import HistoryPanel from './components/HistoryPanel';
import ReviewPanel from './components/ReviewPanel';
import type { ReviewResult } from './libs/types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [reviewData, setReviewData] = useState<ReviewResult | undefined>(undefined);

  const renderMainContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePanel />;
      case 'upload':
        return (
          <UploadPanel
            onReviewComplete={(data: ReviewResult) => {
              setReviewData(data);
              setActiveSection('review');
            }}
          />
        );
      case 'review':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Review Panel
            </h2>
            <ReviewPanel data={reviewData} />
          </div>
        );
      case 'history':
        return <HistoryPanel />;
      case 'settings':
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <TopNavigation onSettingsClick={() => setActiveSection('settings')} />
        <div className="flex">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <main className="flex-1 min-h-[calc(100vh-80px)] overflow-auto">
            <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
