import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Clock, Code, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import CodeEditor from './CodeEditor';

const QuestionForm = () => {
  const navigate = useNavigate();
  const { assessmentId, questionId } = useParams();
  const isEdit = !!questionId;

  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    problem_statement: '',
    initial_code: '',
    language: 'javascript',
    difficulty: 'medium',
    time_limit: 30,
    points: 100,
    test_cases: [
      { input: '', expected: '', description: '', is_hidden: false }
    ]
  });

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'sql', label: 'SQL' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Facile', color: 'green' },
    { value: 'medium', label: 'Moyen', color: 'yellow' },
    { value: 'hard', label: 'Difficile', color: 'red' }
  ];

  useEffect(() => {
    fetchAssessment();
    if (isEdit) {
      fetchQuestion();
    }
  }, [assessmentId, questionId]);

  const fetchAssessment = async () => {
    try {
      const response = await api.get(`/assessments/${assessmentId}`);
      setAssessment(response.data);
      setFormData(prev => ({
        ...prev,
        language: response.data.language || 'javascript'
      }));
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'évaluation');
      navigate('/assessments');
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      const question = response.data;
      setFormData({
        ...question,
        test_cases: JSON.parse(question.test_cases || '[]')
      });
    } catch (error) {
      toast.error('Erreur lors du chargement de la question');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCodeChange = (code) => {
    setFormData(prev => ({
      ...prev,
      initial_code: code
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.test_cases];
    updatedTestCases[index][field] = value;
    setFormData(prev => ({
      ...prev,
      test_cases: updatedTestCases
    }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      test_cases: [
        ...prev.test_cases,
        { input: '', expected: '', description: '', is_hidden: false }
      ]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.test_cases.length > 1) {
      setFormData(prev => ({
        ...prev,
        test_cases: prev.test_cases.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return false;
    }
    if (!formData.problem_statement.trim()) {
      toast.error('L\'énoncé du problème est requis');
      return false;
    }
    if (formData.time_limit < 1 || formData.time_limit > 180) {
      toast.error('Le temps limite doit être entre 1 et 180 minutes');
      return false;
    }
    if (formData.points < 1) {
      toast.error('Les points doivent être supérieurs à 0');
      return false;
    }
    
    for (let i = 0; i < formData.test_cases.length; i++) {
      const tc = formData.test_cases[i];
      if (!tc.input.trim() || !tc.expected.trim()) {
        toast.error(`Le cas de test ${i + 1} est incomplet`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        assessment_id: assessmentId,
        test_cases: JSON.stringify(formData.test_cases)
      };

      if (isEdit) {
        await api.put(`/questions/${questionId}`, payload);
        toast.success('Question mise à jour avec succès');
      } else {
        await api.post('/questions', payload);
        toast.success('Question créée avec succès');
      }
      
      navigate(`/assessments/${assessmentId}/questions`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!assessment) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Modifier la question' : 'Nouvelle question'}
          </h1>
          <p className="mt-2 opacity-90">
            Évaluation: {assessment.title}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la question *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Inverser une chaîne de caractères"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langage de programmation
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Temps limite (minutes) *
              </label>
              <input
                type="number"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleInputChange}
                min="1"
                max="180"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre 1 et 180 minutes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points attribués *
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Énoncé du problème */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Énoncé du problème *
            </label>
            <textarea
              name="problem_statement"
              value={formData.problem_statement}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le problème en détail..."
              required
            />
          </div>

          {/* Code initial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Code className="inline w-4 h-4 mr-1" />
              Code initial (optionnel)
            </label>
            <CodeEditor
              language={formData.language}
              initialCode={formData.initial_code}
              onCodeChange={handleCodeChange}
              height="200px"
              theme="vs-light"
            />
            <p className="text-xs text-gray-500 mt-1">
              Code de démarrage fourni au candidat
            </p>
          </div>

          {/* Cas de test */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Cas de test
              </h3>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un cas
              </button>
            </div>

            <div className="space-y-4">
              {formData.test_cases.map((testCase, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Cas de test {index + 1}
                    </h4>
                    {formData.test_cases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Input (JSON)
                      </label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                        placeholder='Ex: [1, 2, 3] ou {"name": "test"}'
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Output attendu (JSON)
                      </label>
                      <textarea
                        value={testCase.expected}
                        onChange={(e) => handleTestCaseChange(index, 'expected', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                        placeholder='Ex: 6 ou "result"'
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Description (optionnel)
                      </label>
                      <input
                        type="text"
                        value={testCase.description}
                        onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Description du cas de test"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={testCase.is_hidden}
                          onChange={(e) => handleTestCaseChange(index, 'is_hidden', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          Cas de test caché (non visible par le candidat)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Les cas de test doivent être au format JSON valide. Les cas cachés ne seront pas visibles par les candidats.
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/assessments/${assessmentId}/questions`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? 'Mettre à jour' : 'Créer la question'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
