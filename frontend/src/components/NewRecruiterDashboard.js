import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, Eye, Edit, Trash2, 
  Plus, Mail, Phone, Briefcase, Calendar, Award,
  FileText, CheckCircle, XCircle, Clock, X, Send, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const NewRecruiterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [candidateSubmissions, setCandidateSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeCandidates: 0,
    totalAssessments: 0,
    completedSubmissions: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCandidates(),
        fetchAssessments(),
        fetchStats()
      ]);
    } catch (error) {
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/users');
      const candidateUsers = response.data.filter(user => user.role === 'candidate');
      setCandidates(candidateUsers);
    } catch (error) {
      toast.error('Error loading candidates');
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/assessments');
      setAssessments(response.data);
    } catch (error) {
      toast.error('Error loading assessments');
    }
  };

  const fetchStats = async () => {
    try {
      const [candidatesRes, assessmentsRes, submissionsRes] = await Promise.all([
        api.get('/users'),
        api.get('/assessments'),
        api.get('/submissions')
      ]);
      
      const candidateUsers = candidatesRes.data.filter(user => user.role === 'candidate');
      const activeCandidates = candidateUsers.filter(user => user.status === 'active');
      const completedSubmissions = submissionsRes.data.filter(sub => sub.status === 'passed' || sub.status === 'failed');
      
      setStats({
        totalCandidates: candidateUsers.length,
        activeCandidates: activeCandidates.length,
        totalAssessments: assessmentsRes.data.length,
        completedSubmissions: completedSubmissions.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const fetchCandidateSubmissions = async (candidateId) => {
    try {
      const response = await api.get(`/submissions/user/${candidateId}`);
      setCandidateSubmissions(response.data);
    } catch (error) {
      toast.error('Error loading candidate submissions');
      setCandidateSubmissions([]);
    }
  };

  const handleViewCandidate = async (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
    await fetchCandidateSubmissions(candidate.id);
  };

  const handleSendInvitation = (candidate) => {
    setSelectedCandidate(candidate);
    setShowInviteModal(true);
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/users/${candidateId}`);
        toast.success('Candidate deleted successfully');
        fetchCandidates();
      } catch (error) {
        toast.error('Error deleting candidate');
      }
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-gray-600">Manage candidates and assessments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </button>
              <button
                onClick={() => navigate('/create-assessment')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCandidates}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('candidates')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'candidates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Candidates ({stats.totalCandidates})
              </button>
              <button
                onClick={() => setActiveTab('assessments')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'assessments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Assessments ({stats.totalAssessments})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'candidates' && (
              <CandidatesTab 
                candidates={filteredCandidates}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onViewCandidate={handleViewCandidate}
                onDeleteCandidate={handleDeleteCandidate}
                onSendInvitation={handleSendInvitation}
                getStatusBadge={getStatusBadge}
              />
            )}
            
            {activeTab === 'assessments' && (
              <AssessmentsTab 
                assessments={assessments}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCandidateDetails && selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          submissions={candidateSubmissions}
          onClose={() => {
            setShowCandidateDetails(false);
            setSelectedCandidate(null);
          }}
          onSendInvitation={() => {
            setShowCandidateDetails(false);
            setShowInviteModal(true);
          }}
          getScoreColor={getScoreColor}
        />
      )}

      {showAddModal && (
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            fetchCandidates();
            setShowAddModal(false);
          }}
        />
      )}

      {showInviteModal && selectedCandidate && (
        <SendInvitationModal
          candidate={selectedCandidate}
          assessments={assessments}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedCandidate(null);
          }}
          onSent={() => {
            setShowInviteModal(false);
            setSelectedCandidate(null);
            toast.success('Invitation sent successfully!');
          }}
        />
      )}
    </div>
  );
};

// Candidates Tab Component
const CandidatesTab = ({ 
  candidates, 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus,
  onViewCandidate,
  onDeleteCandidate,
  onSendInvitation,
  getStatusBadge 
}) => {
  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {candidate.first_name} {candidate.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(candidate.status)}
                    <span className="text-xs text-gray-500">
                      Joined {new Date(candidate.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewCandidate(candidate)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSendInvitation(candidate)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Send Invitation"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCandidate(candidate.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {candidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Start by adding your first candidate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Assessments Tab Component
const AssessmentsTab = ({ assessments, navigate }) => {
  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: Edit },
      archived: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[difficulty] || badges.medium}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="grid gap-6">
      {assessments.map((assessment) => (
        <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                {getStatusBadge(assessment.status)}
                {getDifficultyBadge(assessment.difficulty)}
              </div>
              
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {assessment.duration} minutes
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {assessment.language}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(assessment.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => navigate(`/assessments/${assessment.id}`)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="View Assessment"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate(`/assessments/${assessment.id}/edit`)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Assessment"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {assessments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600">Create your first assessment to get started.</p>
        </div>
      )}
    </div>
  );
};

export default NewRecruiterDashboard;
