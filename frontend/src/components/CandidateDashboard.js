import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { apiService } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  Calendar,
  Award,
  AlertCircle,
  FileText,
  LogOut,
  User,
  Lock
} from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Password modal removed - handled at login
  // activeTests logic removed - simplified workflow

  useEffect(() => {
    // checkFirstLogin removed - password handled at login
    fetchCandidateData();
  }, []);

  // checkFirstLogin function removed - password handled at login

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      
      // Fetch candidate's assigned assessments
      const invitationsRes = await apiService.get('/api/candidate-portal/my-invitations');
      const submissionsRes = await apiService.get('/api/candidate-portal/my-submissions');
      
      setAssessments(invitationsRes.data?.invitations || []);
      setSubmissions(submissionsRes.data?.submissions || []);
    } catch (error) {
      console.error('Error fetching candidate data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // handleSetPassword function removed - password handled at login

  const startTest = async (e, assessmentId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Mark test as started in backend
      await apiService.post(`/api/candidate-portal/start-test/${assessmentId}`);
      
      // Refresh data to update button state
      await fetchCandidateData();
      
      console.log('Starting test for assessment:', assessmentId);
      // Navigate to the correct route for taking assessment
      navigate(`/take-assessment/${assessmentId}`);
    } catch (error) {
      console.error('Error starting test:', error);
      if (error.response?.status === 400) {
        toast.error('Test already started or expired');
      } else {
        toast.error('Failed to start test');
      }
    }
  };

  const endTest = (assessmentId) => {
    // Remove test from active tests
    const currentActiveTests = JSON.parse(localStorage.getItem('activeTests') || '{}');
    delete currentActiveTests[assessmentId];
    localStorage.setItem('activeTests', JSON.stringify(currentActiveTests));
    setActiveTests(currentActiveTests);
  };

  const getTestStatus = (assessment) => {
    // Check if test is completed
    const submission = submissions.find(s => s.assessment_id === assessment.id);
    if (submission?.status === 'completed') {
      return 'completed';
    }
    
    // Check if test is expired
    if (assessment.expires_at && new Date(assessment.expires_at) < new Date()) {
      return 'expired';
    }
    
    // Check if invitation is accepted (test started)
    if (assessment.status === 'accepted') {
      return 'started';
    }
    
    // Default to pending
    return 'pending';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle,
        text: 'Completed'
      },
      started: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: Lock,
        text: 'Started'
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        text: 'Pending'
      },
      expired: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle,
        text: 'Expired'
      }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
  };

  const handleLogout = async () => {
    // Clear active tests for this user
    localStorage.removeItem('activeTests');
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Candidate Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-semibold">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold">
                  {assessments.filter(a => getTestStatus(a) === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold">
                  {assessments.filter(a => getTestStatus(a) === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-semibold">
                  {submissions.length > 0 
                    ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Assessments</h2>
          </div>
          
          <div className="p-6">
            {assessments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments assigned</h3>
                <p className="text-gray-600">You don't have any assessments to complete yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment) => {
                  const status = getTestStatus(assessment);
                  
                  return (
                    <div 
                      key={assessment.id} 
                      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">
                          {assessment.title}
                        </h3>
                        {getStatusBadge(status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {assessment.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          Duration: {assessment.duration} minutes
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="w-4 h-4 mr-2" />
                          Language: {assessment.language}
                        </div>
                        {assessment.expires_at && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            Expires: {new Date(assessment.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {status === 'pending' && (
                        <button
                          type="button"
                          onClick={(e) => startTest(e, assessment.id)}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Test
                        </button>
                      )}
                      
                      {status === 'started' && (
                        <div className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded-lg text-center font-medium cursor-not-allowed">
                          Test Already Started
                        </div>
                      )}
                      
                      {status === 'completed' && (
                        <button
                          onClick={() => navigate(`/assessment-results/${assessment.id}`)}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          View Results
                        </button>
                      )}
                      
                      {status === 'expired' && (
                        <div className="w-full py-2 px-4 bg-red-100 text-red-800 rounded-lg text-center font-medium">
                          Test Expired
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Password modal removed - handled at login */}
    </div>
  );
};

export default CandidateDashboard;
