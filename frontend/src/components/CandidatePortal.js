import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const CandidatePortal = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invitations/validate/${token}`);
      
      if (response.data.valid) {
        setInvitation(response.data.invitation);
        setAssessment(response.data.assessment);
      } else {
        setError('Invalid or expired invitation link');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setError('Invalid or expired invitation link');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    try {
      const response = await api.post(`/invitations/${token}/start`);
      
      if (response.data.success) {
        // Store the token for the assessment session
        localStorage.setItem('assessmentToken', token);
        navigate(`/assessment/${assessment.id}/take`);
      }
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start the test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{error}</h2>
            <p className="mt-2 text-gray-600">
              Please contact your recruiter for a new invitation link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Assessment Invitation</h1>
            <p className="mt-2 text-indigo-200">
              You've been invited to complete an assessment
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome, {invitation?.candidate_name}!
              </h2>
              <p className="text-gray-600">
                You have been invited to complete the following assessment:
              </p>
            </div>

            {/* Assessment Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {assessment?.title}
              </h3>
              <p className="text-gray-600 mb-4">{assessment?.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {assessment?.duration} minutes
                  </p>
                </div>
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {assessment?.question_count || 'Multiple'}
                  </p>
                </div>
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {assessment?.difficulty || 'Mixed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Before you begin:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Ensure you have a stable internet connection
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Find a quiet environment free from distractions
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Have {assessment?.duration} minutes available to complete the assessment
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Once started, you must complete the assessment in one session
                  </span>
                </li>
              </ul>
            </div>

            {/* Status Check */}
            {invitation?.status === 'completed' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Assessment Completed
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      You have already completed this assessment. Thank you for your participation!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleStartTest}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                >
                  Start Assessment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Having trouble? Contact support at{' '}
            <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;
