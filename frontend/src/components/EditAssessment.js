import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, X, Plus, Trash2, Search } from 'lucide-react';
import api, { apiService } from '../services/api';

const EditAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    is_active: true,
    questions: []
  });
  const [allQuestions, setAllQuestions] = useState([]);
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    language: 'javascript',
    difficulty: 'intermediate',
    template_code: '',
    time_limit: 60,
    points: 10
  });

  useEffect(() => {
    fetchAssessment();
    fetchAllQuestions();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching assessment with ID:', id);
      const response = await api.assessments.getById(id);
      console.log('✅ Assessment loaded:', response.data);
      setAssessment(response.data);
    } catch (error) {
      console.error('❌ Error fetching assessment:', error);
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
      
      if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this assessment');
      } else if (error.response?.status === 404) {
        toast.error('Assessment not found');
      } else {
        toast.error('Failed to load assessment: ' + (error.response?.data?.message || error.message));
      }
      
      // Wait a bit before redirecting to show the error message
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await api.questions.getAll();
      setAllQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assessment.title || !assessment.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      // Update assessment
      await api.assessments.update(id, assessment);
      
      // Recalculate duration directly using Assessment model approach
      try {
        // Fetch updated assessment with calculated duration
        const updatedAssessment = await api.assessments.getById(id);
        console.log('🔄 Fetched updated assessment:', updatedAssessment.data);
        
        // Calculate duration from questions
        const questions = updatedAssessment.data.questions || [];
        const calculatedDuration = questions.reduce((total, question) => {
          return total + (question.time_limit || 0);
        }, 0);
        
        console.log('🔄 Calculated duration from questions:', calculatedDuration);
        
        // Update assessment duration in database
        if (calculatedDuration !== assessment.duration) {
          await api.assessments.update(id, { 
            ...assessment, 
            duration: calculatedDuration 
          });
          
          // Update local state
          setAssessment(prev => ({
            ...prev,
            duration: calculatedDuration,
            calculated_duration: calculatedDuration
          }));
          
          toast.success(`Assessment updated - Duration: ${calculatedDuration} min`);
        } else {
          toast.success('Assessment updated successfully');
        }
      } catch (durationError) {
        console.error('Duration calculation failed:', durationError);
        toast.success('Assessment updated successfully');
      }
      
      navigate(`/assessment/${id}`);
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAssessment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRemoveQuestion = async (questionId) => {
    try {
      await api.assessments.removeQuestion(id, questionId);
      toast.success('Question removed from assessment');
      fetchAssessment(); // Refresh to get updated questions
    } catch (error) {
      console.error('Error removing question:', error);
      toast.error('Failed to remove question');
    }
  };

  const handleAddExistingQuestion = async (questionId, points = 10) => {
    try {
      await api.assessments.addExistingQuestion(id, { question_id: questionId, points });
      toast.success('Question added to assessment');
      fetchAssessment(); // Refresh to get updated questions
      setShowAddQuestions(false);
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    const questionData = {
      title: newQuestion.title,
      description: newQuestion.description,
      language: newQuestion.language,
      difficulty: newQuestion.difficulty,
      template_code: newQuestion.template_code,
      time_limit: newQuestion.time_limit, // Already in minutes
      points: newQuestion.points
    };
    
    try {
      await api.assessments.addQuestion(id, questionData);
      toast.success('New question created and added to assessment');
      fetchAssessment(); // Refresh to get updated questions
      setShowCreateQuestion(false);
      setNewQuestion({
        title: '',
        description: '',
        language: 'javascript',
        difficulty: 'intermediate',
        template_code: '',
        time_limit: 60,
        points: 10
      });
    } catch (error) {
      console.error('Error creating question:', error);
      console.log('Error details:', error.response?.data);
      console.log('Question data sent:', JSON.stringify(questionData));
      if (error.response?.data?.errors) {
        console.log('Validation errors:', error.response.data.errors);
      }
      toast.error('Failed to create question: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleNewQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const filteredQuestions = allQuestions.filter(q => 
    !assessment.questions?.some(aq => aq.id === q.id) &&
    (q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     q.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/assessment/${id}`)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Assessment</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={assessment.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={assessment.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Duration - Calculated */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration totale (calculée automatiquement)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={assessment.calculated_duration || assessment.duration || 0}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Somme des durées de toutes les questions ({assessment.questions?.length || 0} questions)
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={assessment.difficulty}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={assessment.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active (candidates can take this assessment)
              </label>
            </div>

            {/* Questions Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateQuestion(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddQuestions(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Add Existing
                  </button>
                </div>
              </div>

              {/* Current Questions */}
              <div className="space-y-3">
                {assessment.questions && assessment.questions.length > 0 ? (
                  assessment.questions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{question.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {question.difficulty}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {question.language}
                            </span>
                            <span className="text-xs text-gray-500">
                              Points: {question.points || 10}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove question from assessment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No questions added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/assessment/${id}`)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Create New Question Modal */}
        {showCreateQuestion && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Question</h3>
                <button
                  onClick={() => setShowCreateQuestion(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newQuestion.title}
                    onChange={handleNewQuestionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    value={newQuestion.description}
                    onChange={handleNewQuestionChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Language and Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      name="language"
                      value={newQuestion.language}
                      onChange={handleNewQuestionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      name="difficulty"
                      value={newQuestion.difficulty}
                      onChange={handleNewQuestionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* Template Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Template Code</label>
                  <textarea
                    name="template_code"
                    value={newQuestion.template_code}
                    onChange={handleNewQuestionChange}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="function solution() {\n  // Your code here\n}"
                  />
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                    <input
                      type="number"
                      name="time_limit"
                      value={newQuestion.time_limit}
                      onChange={handleNewQuestionChange}
                      min="1"
                      max="120"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Temps limite en minutes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Points (possible)</label>
                    <input
                      type="number"
                      name="points"
                      value={newQuestion.points}
                      onChange={handleNewQuestionChange}
                      min="1"
                      max="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Points maximum pour cette question"
                    />
                  </div>
                </div>


                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateQuestion(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Questions Modal */}
        {showAddQuestions && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Existing Questions</h3>
                <button
                  onClick={() => setShowAddQuestions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Available Questions */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{question.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {question.difficulty}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {question.language}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {question.technology}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddExistingQuestion(question.id)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {searchTerm ? 'No questions found matching your search' : 'No available questions to add'}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAddQuestions(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAssessment;
