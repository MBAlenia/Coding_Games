import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Briefcase, Calendar, 
  Award, Github, Linkedin, FileText, Clock, Code,
  CheckCircle, XCircle, AlertCircle, Download, Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCandidateData();
  }, [candidateId]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const [candidateRes, submissionsRes] = await Promise.all([
        api.get(`/users/${candidateId}`),
        api.get(`/submissions/user/${candidateId}/detailed`)
      ]);
      
      setCandidate(candidateRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      navigate('/recruiter-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Candidat non trouvé</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/recruiter-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {candidate.first_name} {candidate.last_name}
                  </h1>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/candidate/${candidateId}/edit`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'tests', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'tests' && 'Tests & Résultats'}
                {tab === 'history' && 'Historique'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {candidate.email}
                    </dd>
                  </div>
                  
                  {candidate.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {candidate.phone}
                      </dd>
                    </div>
                  )}
                  
                  {candidate.company && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {candidate.company}
                      </dd>
                    </div>
                  )}
                  
                  {candidate.position && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Poste</dt>
                      <dd className="mt-1 text-sm text-gray-900">{candidate.position}</dd>
                    </div>
                  )}
                  
                  {candidate.experience_years && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Expérience</dt>
                      <dd className="mt-1 text-sm text-gray-900">{candidate.experience_years} ans</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date d'inscription</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
                
                {/* Skills */}
                {candidate.skills && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Compétences</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(candidate.skills).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Links */}
                <div className="mt-6 flex items-center space-x-4">
                  {candidate.linkedin_url && (
                    <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-blue-600 hover:text-blue-800">
                      <Linkedin className="w-5 h-5 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {candidate.github_url && (
                    <a href={candidate.github_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-gray-700 hover:text-gray-900">
                      <Github className="w-5 h-5 mr-1" />
                      GitHub
                    </a>
                  )}
                  {candidate.resume_url && (
                    <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-green-600 hover:text-green-800">
                      <FileText className="w-5 h-5 mr-1" />
                      CV
                    </a>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              {candidate.notes && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes du recruteur</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{candidate.notes}</p>
                </div>
              )}
            </div>
            
            {/* Stats Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tests complétés</p>
                    <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Score moyen</p>
                    <p className={`text-2xl font-bold ${getScoreColor(
                      submissions.reduce((acc, s) => acc + (s.score || 0), 0) / (submissions.length || 1)
                    )}`}>
                      {Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / (submissions.length || 1))}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Dernier test</p>
                    <p className="text-sm text-gray-900">
                      {submissions.length > 0 
                        ? new Date(submissions[0].submitted_at).toLocaleDateString()
                        : 'Aucun test'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Résultats des tests</h2>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <Code className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun test complété</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ce candidat n'a pas encore passé de test
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(submission.status)}
                          <h3 className="text-sm font-medium text-gray-900">
                            {submission.question_title}
                          </h3>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-500">
                          {submission.assessment_title} • {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                        
                        {submission.language && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {submission.language}
                          </span>
                        )}
                        
                        {submission.execution_time && (
                          <p className="mt-2 text-xs text-gray-500">
                            Temps d'exécution: {submission.execution_time}ms
                          </p>
                        )}
                        
                        {submission.error_message && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">{submission.error_message}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </p>
                        <button
                          onClick={() => navigate(`/submission/${submission.id}`)}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                    
                    {/* Code preview */}
                    {submission.code && (
                      <div className="mt-4">
                        <details className="cursor-pointer">
                          <summary className="text-sm font-medium text-gray-700">Voir le code</summary>
                          <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                            <code>{submission.code}</code>
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des actions</h2>
            <p className="text-sm text-gray-500">Fonctionnalité à venir...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetails;
