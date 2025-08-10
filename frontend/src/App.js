import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SetPassword from './components/SetPassword';
import Dashboard from './components/Dashboard';
import AssessmentsList from './components/AssessmentsList';
import CreateAssessment from './components/CreateAssessment';
import AssessmentDetail from './components/AssessmentDetail';
import AddQuestions from './components/AddQuestions';
import ManageUsers from './components/ManageUsers';
import TakeAssessment from './components/TakeAssessment';
import ResultsDashboard from './components/ResultsDashboard';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import CandidateInvitations from './components/CandidateInvitations';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import CandidateDetails from './components/CandidateDetails';
import QuestionForm from './components/QuestionForm';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate-dashboard" replace />;
  } else {
    return <Navigate to="/recruiter-dashboard" replace />;
  }
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return children;
  }
  
  // Redirect based on user role
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate-dashboard" />;
  } else {
    return <Navigate to="/recruiter-dashboard" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/invitation/:token" 
              element={
                <PublicRoute>
                  <SetPassword />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/recruiter-dashboard" 
              element={
                <ProtectedRoute>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/candidate-dashboard" 
              element={
                <ProtectedRoute>
                  <CandidateDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy dashboard route - redirect based on role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />
            
            <Route 
              path="/assessments" 
              element={
                <ProtectedRoute>
                  <AssessmentsList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create-assessment" 
              element={
                <ProtectedRoute>
                  <CreateAssessment />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manage-users" 
              element={
                <ProtectedRoute>
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/candidate-invitations" 
              element={
                <ProtectedRoute>
                  <CandidateInvitations />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/candidate/:candidateId" 
              element={
                <ProtectedRoute>
                  <CandidateDetails />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assessments/:assessmentId/questions/new" 
              element={
                <ProtectedRoute>
                  <QuestionForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assessments/:assessmentId/questions/:questionId/edit" 
              element={
                <ProtectedRoute>
                  <QuestionForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assessments/:assessmentId" 
              element={
                <ProtectedRoute>
                  <AssessmentDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assessments/:assessmentId/add-questions" 
              element={
                <ProtectedRoute>
                  <AddQuestions />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/take-assessment/:assessmentId" 
              element={
                <ProtectedRoute>
                  <TakeAssessment />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manage-users" 
              element={
                <ProtectedRoute>
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect - role based */}
            <Route path="/" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />
            
            {/* Catch all route - role based */}
            <Route path="*" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
