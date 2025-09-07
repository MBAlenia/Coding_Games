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
    points: 100
  });

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
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
        ...question
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
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        assessment_id: assessmentId
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
                size="1"
                style={{ height: 'auto' }}
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

          {/* Note sur l'évaluation IA */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Évaluation par Intelligence Artificielle
                </h4>
                <p className="text-sm text-blue-700">
                  Cette question sera automatiquement évaluée par notre IA. 
                  L'IA analysera la réponse du candidat en fonction de l'énoncé et attribuera un score sur {formData.points} points.
                  Aucun test case manuel n'est nécessaire.
                </p>
              </div>
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
