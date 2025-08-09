import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AddQuestions = () => {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    description: '',
    language: 'javascript',
    template_code: '',
    test_cases: ''
  });

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

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post(`/api/assessments/${assessmentId}/questions`, questionForm);
      setQuestions([...questions, response.data]);
      setQuestionForm({
        title: '',
        description: '',
        language: 'javascript',
        template_code: '',
        test_cases: ''
      });
      setShowQuestionForm(false);
      toast.success('Question added successfully!');
    } catch (error) {
      toast.error('Failed to add question');
      console.error('Error adding question:', error);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await apiService.delete(`/api/questions/${questionId}`);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error('Failed to delete question');
      console.error('Error deleting question:', error);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>
          <p className="mt-2 text-gray-600">{assessment.description}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Duration: {assessment.duration} minutes</span>
            <span className="mx-2">•</span>
            <span>Language: {assessment.language}</span>
            <span className="mx-2">•</span>
            <span>Questions: {questions.length}</span>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Questions</h2>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Question
          </button>
        </div>

        {showQuestionForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Add New Question</h3>
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Question Title</label>
                <input
                  type="text"
                  required
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Implement a function to reverse a string"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={4}
                  value={questionForm.description}
                  onChange={(e) => setQuestionForm({...questionForm, description: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Detailed description of what the candidate needs to implement..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Programming Language</label>
                  <select
                    value={questionForm.language}
                    onChange={(e) => setQuestionForm({...questionForm, language: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Template Code</label>
                <textarea
                  rows={6}
                  value={questionForm.template_code}
                  onChange={(e) => setQuestionForm({...questionForm, template_code: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="function reverseString(str) {&#10;  // Your code here&#10;  return '';&#10;}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Test Cases (JSON format)</label>
                <textarea
                  rows={4}
                  value={questionForm.test_cases}
                  onChange={(e) => setQuestionForm({...questionForm, test_cases: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder='[{"input": "hello", "expected": "olleh"}, {"input": "world", "expected": "dlrow"}]'
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
              <p className="text-gray-600 mb-4">Add your first question to complete this assessment.</p>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Add First Question
              </button>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}: {question.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{question.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {question.language}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/questions/${question.id}/edit`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => window.location.href = '/assessments'}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Assessments
          </button>
          {questions.length > 0 && (
            <button
              onClick={() => window.location.href = `/assessments/${assessmentId}`}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Preview Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
