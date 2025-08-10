import axios from 'axios';

// Configure base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
axios.defaults.baseURL = API_BASE_URL;

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => axios.post('/api/auth/login', credentials),
    register: (userData) => axios.post('/api/auth/register', userData),
    profile: () => axios.get('/api/auth/profile'),
    refresh: () => axios.post('/api/auth/refresh'),
    forgotPassword: (email) => axios.post('/api/auth/forgot-password', { email }),
    resetPassword: (data) => axios.post('/api/auth/reset-password', data),
    validateInvitation: (token) => axios.get(`/api/auth/validate-invitation/${token}`),
    setFirstPassword: (data) => axios.post('/api/auth/set-first-password', data)
  },

  // Assessment endpoints
  assessments: {
    getAll: () => axios.get('/api/assessments'),
    getById: (id) => axios.get(`/api/assessments/${id}`),
    create: (data) => axios.post('/api/assessments', data),
    update: (id, data) => axios.put(`/api/assessments/${id}`, data),
    delete: (id) => axios.delete(`/api/assessments/${id}`),
    addQuestion: (id, questionData) => axios.post(`/api/assessments/${id}/questions`, questionData)
  },

  // Question endpoints
  questions: {
    getByAssessment: (assessmentId) => axios.get(`/api/questions/assessment/${assessmentId}`),
    create: (assessmentId, data) => axios.post(`/api/questions/assessment/${assessmentId}`, data),
    getById: (id) => axios.get(`/api/questions/${id}`),
    update: (id, data) => axios.put(`/api/questions/${id}`, data),
    delete: (id) => axios.delete(`/api/questions/${id}`)
  },

  // Submission endpoints
  submissions: {
    submit: (questionId, data) => axios.post(`/api/submissions/questions/${questionId}`, data),
    getById: (id) => axios.get(`/api/submissions/${id}`),
    getUserSubmissions: () => axios.get('/api/submissions/users/me'),
    getQuestionSubmissions: (questionId) => axios.get(`/api/submissions/questions/${questionId}/all`),
    getAssessmentResults: (assessmentId) => axios.get(`/api/submissions/assessments/${assessmentId}/results`)
  },

  // Candidate management endpoints
  candidates: {
    getAll: () => axios.get('/api/candidates'),
    getById: (id) => axios.get(`/api/candidates/${id}`),
    create: (data) => axios.post('/api/candidates', data),
    update: (id, data) => axios.put(`/api/candidates/${id}`, data),
    delete: (id) => axios.delete(`/api/candidates/${id}`),
    getSubmissions: (id) => axios.get(`/api/candidates/${id}/submissions`),
    getHistory: (id) => axios.get(`/api/candidates/${id}/history`),
    addHistory: (id, data) => axios.post(`/api/candidates/${id}/history`, data)
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => axios.get('/api/candidates/dashboard/stats')
  }
};

// Create a unified API service
export const apiService = {
  get: (url) => axios.get(url),
  post: (url, data) => axios.post(url, data),
  put: (url, data) => axios.put(url, data),
  delete: (url) => axios.delete(url)
};

export default api;
