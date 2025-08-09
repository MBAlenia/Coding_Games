import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  BarChart3, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  Eye,
  Play,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ModernDashboard = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalCandidates: 0,
    avgScore: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/assessments');
      setAssessments(response.data.assessments || []);
      
      // Calculate stats
      const totalAssessments = response.data.assessments?.length || 0;
      setStats({
        totalAssessments,
        totalCandidates: 42, // Mock data
        avgScore: 78.5,
        recentActivity: [
          { type: 'assessment', title: 'JavaScript Basics completed by John Doe', time: '2 hours ago' },
          { type: 'submission', title: 'New submission for Python Challenge', time: '4 hours ago' },
          { type: 'candidate', title: 'Alice Johnson joined the platform', time: '1 day ago' }
        ]
      });
    } catch (error) {
      console.error('Fetch assessments error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              {trend && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, to, onClick }) => (
    <div className="group cursor-pointer" onClick={onClick}>
      <Link to={to} className="block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group-hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const AssessmentCard = ({ assessment }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{assessment.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {assessment.duration || 60} min
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(assessment.created_at).toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              assessment.status === 'active' ? 'bg-green-100 text-green-800' :
              assessment.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {assessment.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Link
            to={`/assessments/${assessment.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/assessments/${assessment.id}/results`}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="View Results"
          >
            <BarChart3 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name || user?.username}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your coding assessments today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Assessments"
            value={stats.totalAssessments}
            subtitle="+12% from last month"
            icon={BarChart3}
            color="blue"
            trend={true}
          />
          <StatCard
            title="Active Candidates"
            value={stats.totalCandidates}
            subtitle="+8% from last week"
            icon={Users}
            color="green"
            trend={true}
          />
          <StatCard
            title="Average Score"
            value={`${stats.avgScore}%`}
            subtitle="Platform average"
            icon={Award}
            color="yellow"
          />
          <StatCard
            title="Completion Rate"
            value="89%"
            subtitle="+5% improvement"
            icon={TrendingUp}
            color="purple"
            trend={true}
          />
        </div>

        {/* Quick Actions */}
        {(user?.role === 'admin' || user?.role === 'recruiter') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                title="Create Assessment"
                description="Start building a new coding challenge"
                icon={Plus}
                color="blue"
                to="/create-assessment"
              />
              <QuickActionCard
                title="Send Invitations"
                description="Email assessments to candidates"
                icon={Users}
                color="green"
                to="/candidate-invitations"
              />
              <QuickActionCard
                title="View Analytics"
                description="Detailed performance insights"
                icon={BarChart3}
                color="purple"
                to="/analytics"
              />
              <QuickActionCard
                title="Manage Users"
                description="User administration panel"
                icon={Settings}
                color="orange"
                to="/manage-users"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.slice(0, 6).map((assessment) => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No assessments found</p>
                  {user?.role !== 'candidate' && (
                    <Link
                      to="/create-assessment"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Assessment
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
