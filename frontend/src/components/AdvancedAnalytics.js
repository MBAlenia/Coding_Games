import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Award, Download, Filter } from 'lucide-react';
import api from '../services/api';

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalAssessments: 0,
    totalCandidates: 0,
    averageScore: 0,
    completionRate: 0,
    topPerformers: [],
    languageStats: {},
    timeStats: {},
    difficultyStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate analytics data - in real app, this would come from API
      const mockAnalytics = {
        totalAssessments: 25,
        totalCandidates: 150,
        averageScore: 76.5,
        completionRate: 89.2,
        topPerformers: [
          { name: 'Alice Johnson', score: 95.5, assessments: 3 },
          { name: 'Bob Smith', score: 92.0, assessments: 2 },
          { name: 'Carol Davis', score: 88.5, assessments: 4 }
        ],
        languageStats: {
          javascript: { count: 45, avgScore: 78.2 },
          python: { count: 32, avgScore: 74.8 },
          sql: { count: 18, avgScore: 82.1 }
        },
        timeStats: {
          avgCompletionTime: 1847, // seconds
          fastestCompletion: 892,
          slowestCompletion: 3421
        },
        difficultyStats: {
          easy: { count: 35, avgScore: 85.2, passRate: 94.3 },
          medium: { count: 42, avgScore: 75.8, passRate: 78.6 },
          hard: { count: 18, avgScore: 62.4, passRate: 55.6 }
        }
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = 'blue' }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive performance insights</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Assessments"
            value={analytics.totalAssessments}
            subtitle="Active assessments"
            icon={BarChart3}
            color="blue"
          />
          <StatCard
            title="Total Candidates"
            value={analytics.totalCandidates}
            subtitle="Unique participants"
            icon={Users}
            color="green"
          />
          <StatCard
            title="Average Score"
            value={`${analytics.averageScore}%`}
            subtitle="Platform average"
            icon={Award}
            color="yellow"
          />
          <StatCard
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            subtitle="Assessment completion"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Language Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Performance</h3>
            <div className="space-y-4">
              {Object.entries(analytics.languageStats).map(([lang, stats]) => (
                <div key={lang} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{lang}</p>
                    <p className="text-sm text-gray-500">{stats.count} assessments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{stats.avgScore}%</p>
                    <p className="text-xs text-gray-500">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Analysis</h3>
            <div className="space-y-4">
              {Object.entries(analytics.difficultyStats).map(([difficulty, stats]) => (
                <div key={difficulty}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 capitalize">{difficulty}</span>
                    <span className="text-sm text-gray-500">{stats.count} assessments</span>
                  </div>
                  <ProgressBar
                    label={`Pass Rate: ${stats.passRate}%`}
                    value={stats.passRate}
                    color={difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'yellow' : 'red'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {analytics.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-500">{performer.assessments} assessments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{performer.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average Completion Time</span>
                <span className="font-semibold text-gray-900">
                  {formatTime(analytics.timeStats.avgCompletionTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fastest Completion</span>
                <span className="font-semibold text-green-600">
                  {formatTime(analytics.timeStats.fastestCompletion)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Slowest Completion</span>
                <span className="font-semibold text-red-600">
                  {formatTime(analytics.timeStats.slowestCompletion)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
