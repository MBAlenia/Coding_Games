import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Award, FileText, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/api/assessments/${assessmentId}/my-results`);
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load assessment results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load assessment results.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Assessment Results</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{results.assessment.title}</h2>
                <p className="text-gray-600 mt-1">{results.assessment.description}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getScoreBadge(results.results.averageScore)}`}>
                  <Award className="w-5 h-5 mr-2" />
                  {results.results.averageScore.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-600 font-medium">Total Questions</p>
                    <p className="text-2xl font-bold text-blue-900">{results.results.totalQuestions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm text-green-600 font-medium">Answered</p>
                    <p className="text-2xl font-bold text-green-900">{results.results.answeredQuestions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 font-medium">Unanswered</p>
                    <p className="text-2xl font-bold text-gray-900">{results.results.unansweredQuestions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm text-purple-600 font-medium">Duration</p>
                    <p className="text-2xl font-bold text-purple-900">{results.assessment.duration}min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Question by Question Results</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {results.results.questionResults.map((question, index) => (
                <div key={question.questionId} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          Question {index + 1}
                        </span>
                        {question.answered ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h4>
                      <p className="text-gray-600 text-sm">{question.description}</p>
                    </div>
                    
                    <div className="text-right ml-6">
                      {question.answered ? (
                        <div>
                          <div className={`text-2xl font-bold ${getScoreColor(question.percentage)}`}>
                            {question.score.toFixed(1)}/{question.maxScore}
                          </div>
                          <div className={`text-sm font-medium ${getScoreColor(question.percentage)}`}>
                            {question.percentage.toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <div className="text-2xl font-bold">-/-</div>
                          <div className="text-sm">Not answered</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {question.answered && (
                    <div className="space-y-4">
                      {/* Candidate Answer */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h5>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                            {question.candidateAnswer}
                          </pre>
                        </div>
                      </div>

                      {/* AI Feedback */}
                      {question.feedback && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            AI Feedback:
                          </h5>
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                            <p className="text-sm text-blue-800">{question.feedback}</p>
                          </div>
                        </div>
                      )}

                      {/* Submission Time */}
                      {question.submittedAt && (
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(question.submittedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
