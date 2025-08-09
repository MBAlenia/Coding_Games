import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      const response = await apiService.get(`/api/assessments/${assessmentId}`);
      setAssessment(response.data);
      setQuestions(response.data.questions || []);
    } catch (error) {
      toast.error('Failed to fetch assessment');
      console.error('Error fetching assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    if (questions.length === 0) {
      toast.error('This assessment has no questions yet');
      return;
    }
    // Redirect to first question
    window.location.href = `/assessments/${assessmentId}/questions/${questions[0].id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h2>
          <button
            onClick={() => window.location.href = '/assessments'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{assessment.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{assessment.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Duration</h3>
                <p className="text-2xl font-bold text-indigo-600">{assessment.duration} min</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Language</h3>
                <p className="text-2xl font-bold text-indigo-600">{assessment.language}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Questions</h3>
                <p className="text-2xl font-bold text-indigo-600">{questions.length}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Questions Overview</h2>
            {questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">This assessment has no questions yet.</p>
                {(user.role === 'admin' || user.role === 'recruiter') && (
                  <button
                    onClick={() => window.location.href = `/assessments/${assessmentId}/add-questions`}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Questions
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      Question {index + 1}: {question.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{question.description}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.language}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => window.location.href = '/assessments'}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Assessments
            </button>

            <div className="flex space-x-4">
              {(user.role === 'admin' || user.role === 'recruiter') && (
                <>
                  <button
                    onClick={() => window.location.href = `/assessments/${assessmentId}/add-questions`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Manage Questions
                  </button>
                  <button
                    onClick={() => window.location.href = `/assessments/${assessmentId}/results`}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                  >
                    View Results
                  </button>
                </>
              )}
              
              {user.role === 'candidate' && questions.length > 0 && (
                <button
                  onClick={startAssessment}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 text-lg font-medium"
                >
                  Start Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;
