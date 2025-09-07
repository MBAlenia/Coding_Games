import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const QuestionLibrary = ({ onSelectQuestions, selectedQuestions = [] }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    technology: '',
    difficulty: '',
    search: ''
  });
  const [selectedIds, setSelectedIds] = useState(new Set(selectedQuestions.map(q => q.id)));

  const technologies = ['JavaScript', 'Python', 'SQL', 'Java', 'C++', 'General'];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.technology) params.append('technology', filters.technology);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      
      const response = await apiService.get(`/api/question-library?${params.toString()}`);
      setQuestions(response.data);
    } catch (error) {
      toast.error('Failed to fetch questions');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionToggle = (question) => {
    const newSelectedIds = new Set(selectedIds);
    
    if (selectedIds.has(question.id)) {
      newSelectedIds.delete(question.id);
    } else {
      newSelectedIds.add(question.id);
    }
    
    setSelectedIds(newSelectedIds);
    
    const selectedQuestionsList = questions.filter(q => newSelectedIds.has(q.id));
    onSelectQuestions(selectedQuestionsList);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTechnologyColor = (technology) => {
    const colors = {
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'Python': 'bg-blue-100 text-blue-800',
      'SQL': 'bg-purple-100 text-purple-800',
      'Java': 'bg-red-100 text-red-800',
      'C++': 'bg-gray-100 text-gray-800',
      'General': 'bg-indigo-100 text-indigo-800'
    };
    return colors[technology] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filter Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
            <select
              value={filters.technology}
              onChange={(e) => setFilters({...filters, technology: e.target.value})}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Technologies</option>
              {technologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search questions..."
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Selected Questions Summary */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-indigo-800">
            <strong>{selectedIds.size}</strong> question{selectedIds.size !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions found matching your filters.
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className={`bg-white p-6 rounded-lg shadow cursor-pointer transition-all ${
                selectedIds.has(question.id) 
                  ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleQuestionToggle(question)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(question.id)}
                      onChange={() => handleQuestionToggle(question)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <h4 className="text-lg font-medium text-gray-900">{question.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{question.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTechnologyColor(question.technology)}`}>
                      {question.technology}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {question.language}
                    </span>
                  </div>
                  
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Used in {question.used_count || 0} assessment{question.used_count !== 1 ? 's' : ''}
                    {question.created_by_email && (
                      <span> • Created by {question.created_by_email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionLibrary;
