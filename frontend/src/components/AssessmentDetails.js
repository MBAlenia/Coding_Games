import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import api from '../services/api';

const AssessmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAssessmentDetails();
  }, [id]);

  const fetchAssessmentDetails = async () => {
    try {
      setLoading(true);
      const [assessmentRes, questionsRes, invitationsRes] = await Promise.all([
        api.get(`/assessments/${id}`),
        api.get(`/assessments/${id}/questions`),
        api.get(`/assessments/${id}/invitations`)
      ]);

      setAssessment(assessmentRes.data);
      setQuestions(questionsRes.data || []);
      setInvitations(invitationsRes.data || []);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      toast.error('Failed to load assessment details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await api.delete(`/questions/${questionId}`);
      toast.success('Question deleted successfully');
      fetchAssessmentDetails();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteAssessment = async () => {
    if (!window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) return;

    try {
      await api.delete(`/assessments/${id}`);
      toast.success('Assessment deleted successfully');
      navigate('/assessments');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Assessment not found</h2>
          <button
            onClick={() => navigate('/assessments')}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/assessments')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
                  <p className="text-gray-600 mt-1">{assessment.description}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/assessment/${id}/edit`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteAssessment}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{assessment.calculated_duration || assessment.duration || 0} min</p>
                <p className="text-xs text-gray-500 mt-1">Calculée automatiquement</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invitations.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'questions', 'invitations', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">Difficulty:</dt>
                    <dd className="text-sm font-medium text-gray-900 capitalize">{assessment.difficulty}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Status:</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {assessment.is_active ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-gray-500">Inactive</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Created:</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Statistics</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">Completion Rate:</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {invitations.length > 0
                        ? `${Math.round((invitations.filter(i => i.status === 'completed').length / invitations.length) * 100)}%`
                        : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Average Score:</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {invitations.filter(i => i.score !== null).length > 0
                        ? `${Math.round(invitations.filter(i => i.score !== null).reduce((acc, i) => acc + i.score, 0) / invitations.filter(i => i.score !== null).length)}%`
                        : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Questions ({questions.length})</h2>
              <button
                onClick={() => navigate(`/assessment/${id}/add-question`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 mr-2">#{index + 1}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {question.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{question.title}</h3>
                    <p className="text-gray-600">{question.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/question/${question.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Invitations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invitation.candidate_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{invitation.candidate_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invitation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          invitation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invitation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.score !== null ? `${invitation.score}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Results</h2>
            <div className="space-y-4">
              {invitations.filter(i => i.status === 'completed').map((invitation) => (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{invitation.candidate_name}</h3>
                      <p className="text-sm text-gray-500">{invitation.candidate_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{invitation.score}%</p>
                      <p className="text-sm text-gray-500">
                        Completed {new Date(invitation.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {invitations.filter(i => i.status === 'completed').length === 0 && (
                <p className="text-center text-gray-500 py-8">No completed assessments yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetails;
