import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  Mail, 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CandidateInvitations = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '' });
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);

  useEffect(() => {
    fetchAssessments();
    fetchCandidates();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/api/assessments');
      setAssessments(response.data.assessments || []);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      toast.error('Failed to load assessments');
    }
  };

  const fetchCandidates = async () => {
    try {
      // For now, we'll use a mock list of candidates
      // In a real app, you'd have a candidates endpoint
      const mockCandidates = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', status: 'active' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', status: 'active' },
        { id: 5, name: 'David Brown', email: 'david.brown@example.com', status: 'active' }
      ];
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      toast.error('Failed to load candidates');
    }
  };

  const fetchInvitations = async (assessmentId) => {
    try {
      const response = await api.get(`/api/assessments/${assessmentId}/invitations`);
      setInvitations(response.data.invitations || []);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      toast.error('Failed to load invitations');
    }
  };

  const addCandidate = () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast.error('Please fill in all fields');
      return;
    }

    const newId = Math.max(...candidates.map(c => c.id), 0) + 1;
    const candidate = {
      id: newId,
      name: newCandidate.name,
      email: newCandidate.email,
      status: 'active'
    };

    setCandidates([...candidates, candidate]);
    setNewCandidate({ name: '', email: '' });
    setShowAddCandidate(false);
    toast.success('Candidate added successfully');
  };

  const removeCandidate = (candidateId) => {
    setCandidates(candidates.filter(c => c.id !== candidateId));
    setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    toast.success('Candidate removed');
  };

  const toggleCandidateSelection = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };

  const selectAllCandidates = () => {
    const filteredCandidates = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const sendInvitations = async () => {
    if (!selectedAssessment) {
      toast.error('Please select an assessment');
      return;
    }

    if (selectedCandidates.length === 0) {
      toast.error('Please select at least one candidate');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const selectedCandidateData = candidates.filter(c => selectedCandidates.includes(c.id));
      
      for (const candidate of selectedCandidateData) {
        try {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

          await api.post(`/api/assessments/${selectedAssessment}/invitations`, {
            candidate_email: candidate.email,
            candidate_name: candidate.name,
            expires_at: expiresAt.toISOString()
          });
          
          successCount++;
        } catch (error) {
          console.error(`Failed to send invitation to ${candidate.email}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} invitation(s) sent successfully!`);
        setSelectedCandidates([]);
        
        // Refresh invitations if viewing them
        if (showInvitations) {
          fetchInvitations(selectedAssessment);
        }
      }

      if (errorCount > 0) {
        toast.error(`Failed to send ${errorCount} invitation(s)`);
      }

    } catch (error) {
      console.error('Send invitations error:', error);
      toast.error('Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAssessmentData = assessments.find(a => a.id.toString() === selectedAssessment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Send Assessment Invitations
          </h1>
          <p className="text-gray-600">
            Select an assessment and candidates to send invitation emails
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Select Assessment
              </h2>
              
              <select
                value={selectedAssessment}
                onChange={(e) => {
                  setSelectedAssessment(e.target.value);
                  if (e.target.value && showInvitations) {
                    fetchInvitations(e.target.value);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an assessment...</option>
                {assessments.map(assessment => (
                  <option key={assessment.id} value={assessment.id}>
                    {assessment.title}
                  </option>
                ))}
              </select>

              {selectedAssessmentData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {selectedAssessmentData.title}
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    {selectedAssessmentData.description}
                  </p>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedAssessmentData.duration || 60} minutes
                  </div>
                </div>
              )}

              {selectedAssessment && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setShowInvitations(!showInvitations);
                      if (!showInvitations) {
                        fetchInvitations(selectedAssessment);
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showInvitations ? 'Hide' : 'View'} Sent Invitations
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Select Candidates ({selectedCandidates.length} selected)
                </h2>
                <button
                  onClick={() => setShowAddCandidate(true)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Candidate
                </button>
              </div>

              {/* Search and Controls */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={selectAllCandidates}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {selectedCandidates.length === filteredCandidates.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Candidates List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedCandidates.includes(candidate.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleCandidateSelection(candidate.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleCandidateSelection(candidate.id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCandidate(candidate.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {filteredCandidates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No candidates found</p>
                </div>
              )}

              {/* Send Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={sendInvitations}
                  disabled={loading || !selectedAssessment || selectedCandidates.length === 0}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Invitations...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send {selectedCandidates.length} Invitation{selectedCandidates.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sent Invitations */}
        {showInvitations && selectedAssessment && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-purple-600" />
                Sent Invitations
              </h2>
              
              {invitations.length > 0 ? (
                <div className="space-y-3">
                  {invitations.map(invitation => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{invitation.candidate_name}</div>
                        <div className="text-sm text-gray-500">{invitation.candidate_email}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {new Date(invitation.created_at).toLocaleDateString()}
                          {invitation.expires_at && (
                            <span className="ml-2">
                              Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invitation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          invitation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {invitation.status}
                        </span>
                        {invitation.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No invitations sent yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Candidate Modal */}
        {showAddCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Candidate</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter candidate name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter candidate email"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCandidate(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCandidate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInvitations;
