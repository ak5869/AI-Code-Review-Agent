import React, { useEffect, useState } from 'react';
import {
  FileSearch,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

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
  reviewDate: string;   // e.g. "2025-06-07 13:55:00"
  reviewSummary: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: CodeIssue[];
}

const HomePanel: React.FC = () => {
  const [history, setHistory] = useState<ReviewEntry[]>([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    issuesFound: 0,
    completedToday: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/history');
        const data = await res.json();
        const entries: ReviewEntry[] = data.history.map((e: any) => ({
          id: e.id.toString(),
          filename: e.filename,
          reviewDate: e.review_date,
          reviewSummary: e.review_summary,
          status: e.status,
          issues: e.issues,
        }));
        setHistory(entries);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const totalReviews = history.length;
    const issuesFound = history.reduce((sum, e) => sum + e.issues.length, 0);
    const completedToday = history.filter(e => {
      const dt = new Date(e.reviewDate + 'Z'); // parse as UTC
      return e.status === 'completed' && dt.toDateString() === todayStr;
    }).length;

    setStats({ totalReviews, issuesFound, completedToday });
  }, [history]);

  const widgets = [
    {
      label: 'Total Reviews',
      value: stats.totalReviews.toString(),
      icon: FileSearch,
    },
    {
      label: 'Issues Found',
      value: stats.issuesFound.toString(),
      icon: AlertTriangle,
    },
    {
      label: 'Completed Today',
      value: stats.completedToday.toString(),
      icon: CheckCircle,
    },
    {
      label: 'Avg Review Time',
      value: '—',
      icon: Clock,
    },
  ];

  // Prepare recent activity (last 4)
  const recent = history.slice(0, 4).map(e => {
    const dt = new Date(e.reviewDate + 'Z');
    return {
      action: e.status === 'completed'
        ? 'Code review completed'
        : e.status === 'in-progress'
          ? 'Review in progress'
          : 'Review failed',
      file: e.filename,
      time: dt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: e.status === 'completed'
        ? 'success'
        : e.status === 'in-progress'
          ? 'pending'
          : 'warning',
    };
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome back!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your code reviews today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Removed Upload Button Panel */}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recent.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-green-400'
                      : activity.status === 'warning'
                      ? 'bg-yellow-400'
                      : 'bg-blue-400'
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.file} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
