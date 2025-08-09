import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { PlusCircle, BookOpen, Users, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await apiService.get('/api/assessments');
      // Ensure we always have an array
      const data = response.data;
      if (Array.isArray(data)) {
        setAssessments(data);
      } else if (data && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      toast.error('Failed to fetch assessments');
      console.error('Fetch assessments error:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage the entire platform',
          actions: [
            { label: 'Create Assessment', href: '/create-assessment', icon: PlusCircle },
            { label: 'View All Assessments', href: '/assessments', icon: BookOpen },
            { label: 'Manage Users', href: '/manage-users', icon: Users },
            { label: 'Platform Analytics', href: '/analytics', icon: BarChart3 }
          ]
        };
      case 'recruiter':
        return {
          title: 'Recruiter Dashboard',
          description: 'Create and manage coding assessments',
          actions: [
            { label: 'Create Assessment', href: '/create-assessment', icon: PlusCircle },
            { label: 'My Assessments', href: '/assessments', icon: BookOpen },
            { label: 'View Results', href: '/results', icon: BarChart3 }
          ]
        };
      case 'candidate':
        return {
          title: 'Candidate Dashboard',
          description: 'Take coding assessments and view your progress',
          actions: [
            { label: 'Available Assessments', href: '/assessments', icon: BookOpen },
            { label: 'My Submissions', href: '/submissions', icon: BarChart3 }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to the coding platform',
          actions: []
        };
    }
  };

  const content = getRoleBasedContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{content.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user?.username}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content.actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <Icon className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Assessments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {user?.role === 'candidate' ? 'Available Assessments' : 'Recent Assessments'}
            </h3>
            
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {user?.role === 'candidate' 
                    ? 'No assessments are available for you at the moment.'
                    : 'Get started by creating a new assessment.'
                  }
                </p>
                {user?.role !== 'candidate' && (
                  <div className="mt-6">
                    <Link
                      to="/create-assessment"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                      Create Assessment
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(assessments) && assessments.slice(0, 6).map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{assessment.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        by {assessment.creator_name}
                      </span>
                      <Link
                        to={`/assessments/${assessment.id}`}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
