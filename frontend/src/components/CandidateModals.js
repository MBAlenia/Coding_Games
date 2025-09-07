import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building, Calendar, FileText, Clock, CheckCircle, Users, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { apiService } from '../services/api';

// Candidate Details Modal
export const CandidateDetailsModal = ({ candidate, submissions, onClose, onSendInvitation, getScoreColor }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {candidate.first_name} {candidate.last_name}
              </h2>
              <p className="text-gray-600">{candidate.email}</p>
            </div>
          </div>
          <button
            onClick={onSendInvitation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Assessment
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Candidate Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">Joined {new Date(candidate.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Assessment History</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Submissions:</span>
                  <span className="text-sm font-medium">{submissions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Passed:</span>
                  <span className="text-sm font-medium text-green-600">
                    {submissions.filter(s => s.status === 'passed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Failed:</span>
                  <span className="text-sm font-medium text-red-600">
                    {submissions.filter(s => s.status === 'failed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className={`text-sm font-medium ${getScoreColor(
                    submissions.length > 0 
                      ? submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length 
                      : 0
                  )}`}>
                    {submissions.length > 0 
                      ? (submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Submissions</h3>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">Question #{submission.question_id}</span>
                        <span className={`text-sm font-medium ${getScoreColor(submission.score)}`}>
                          Score: {submission.score}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {submission.status === 'passed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {submission.status === 'failed' && <XCircle className="w-4 h-4 text-red-600" />}
                        {submission.status === 'running' && <Clock className="w-4 h-4 text-yellow-600" />}
                        <span className="text-sm text-gray-600">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Language: {submission.language} | 
                      Execution: {submission.execution_time}ms |
                      Memory: {submission.memory_used}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No submissions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Candidate Modal - Simplified with only 4 fields
export const AddCandidateModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    username: '' // Optional - will default to email if not provided
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send only the minimal required fields
      const candidateData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username || formData.email // Use email as username if not provided
      };
      
      await api.candidates.create(candidateData);
      toast.success('Candidat ajouté avec succès. Un email sera envoyé pour définir le mot de passe.');
      onSave();
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du candidat');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Candidate</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          The candidate will receive an email to set their password on first login.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              placeholder="candidat@exemple.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              placeholder="Jean"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              placeholder="Dupont"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username (optional)
            </label>
            <input
              type="text"
              placeholder="jean.dupont (par défaut: email)"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              If empty, email will be used as username
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Send Invitation Modal
export const SendInvitationModal = ({ candidate, assessments, onClose, onSent }) => {
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!selectedAssessment) {
      toast.error('Please select an assessment');
      return;
    }

    setLoading(true);
    try {
      await apiService.post(`/api/assessments/${selectedAssessment}/invitations`, {
        candidate_email: candidate.email,
        candidate_name: `${candidate.first_name} ${candidate.last_name}`,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      toast.success(`Invitation sent to ${candidate.first_name} ${candidate.last_name}!`);
      onSent();
    } catch (error) {
      toast.error('Error sending invitation');
    } finally {
      setLoading(false);
    }
  };

  // Fix: Ensure assessments is an array before using find
  const assessmentsArray = Array.isArray(assessments) ? assessments : (assessments?.assessments || []);
  const selectedAssessmentData = assessmentsArray.find(a => a.id == selectedAssessment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Assessment Invitation</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Candidate Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Candidate</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{candidate.first_name} {candidate.last_name}</p>
              <p className="text-sm text-gray-600">{candidate.email}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Assessment
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an assessment...</option>
              {assessmentsArray.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title} ({assessment.language} - {assessment.duration}min - {assessment.difficulty || 'medium'}) - {assessment.status}
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Preview */}
          {selectedAssessmentData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{selectedAssessmentData.title}</h4>
              <p className="text-sm text-blue-800 mb-2">{selectedAssessmentData.description}</p>
              <div className="flex items-center space-x-4 text-xs text-blue-700">
                <span>⏱️ {selectedAssessmentData.duration} minutes</span>
                <span>💻 {selectedAssessmentData.language}</span>
                <span>📊 {selectedAssessmentData.difficulty}</span>
              </div>
            </div>
          )}
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">📧 Email Preview</h4>
            <p className="text-sm text-yellow-700">
              The candidate will receive a professional email with:
            </p>
            <ul className="text-xs text-yellow-700 mt-2 space-y-1">
              <li>• Assessment details and instructions</li>
              <li>• Secure invitation link with token</li>
              <li>• Anti-cheat and timer information</li>
              <li>• Step-by-step guidance</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


