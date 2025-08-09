import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AssessmentsList = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await apiService.get('/assessments');
      setAssessments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assessments');
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAssessment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await apiService.delete(`/assessments/${id}`);
      setAssessments(assessments.filter(a => a.id !== id));
      toast.success('Assessment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete assessment');
      console.error('Error deleting assessment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Assessments</h1>
          <p className="mt-2 text-gray-600">Manage and view all coding assessments</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {assessments.length === 0 ? (
              <li className="px-6 py-8 text-center">
                <p className="text-gray-500">No assessments found</p>
              </li>
            ) : (
              assessments.map((assessment) => (
                <li key={assessment.id}>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {assessment.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {assessment.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Duration: {assessment.duration} minutes</span>
                        <span className="mx-2">•</span>
                        <span>Language: {assessment.language}</span>
                        <span className="mx-2">•</span>
                        <span>Created: {new Date(assessment.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/assessments/${assessment.id}`}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                      >
                        View
                      </button>
                      {(user.role === 'admin' || user.role === 'recruiter') && (
                        <button
                          onClick={() => deleteAssessment(assessment.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsList;
