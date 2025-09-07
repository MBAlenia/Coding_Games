import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Play, Save, Send, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import NotificationSystem, { NotificationBell } from './NotificationSystem';
import CodeEditor from './CodeEditor';

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [submissions, setSubmissions] = useState({});
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationStatus, setCompilationStatus] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    fetchAssessmentData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [assessmentId]);

  useEffect(() => {
    if (timeLeft > 0 && isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft, isRunning]);

  const fetchAssessmentData = async () => {
    try {
      // Get assessment details via candidate route
      const assessmentResponse = await apiService.get(`/api/candidate-portal/assessment/${assessmentId}`);
      const assessmentData = assessmentResponse.data;
      
      setAssessment(assessmentData);
      setQuestions(assessmentData.questions || []);
      // Use calculated duration from assessment (sum of all questions' time_limit)
      const totalDuration = assessmentData.calculated_duration || assessmentData.duration || 60;
      setTimeLeft(totalDuration * 60); // Convert minutes to seconds
      
      // Load template code for first question
      if (assessmentData.questions && assessmentData.questions.length > 0) {
        setCode(assessmentData.questions[0].template_code || '');
      }

      // Start timer
      setIsRunning(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast.error('Failed to load assessment');
      navigate('/dashboard');
    }
  };

  const handleTimeUp = async () => {
    setIsRunning(false);
    toast.error('Time is up! Assessment submitted automatically.');
    
    // Save current code before auto-submission
    if (code.trim()) {
      const currentQuestion = questions[currentQuestionIndex];
      setSubmissions(prev => ({
        ...prev,
        [currentQuestion.id]: code
      }));
    }
    
    await handleSubmitAssessment(true); // true = auto-submit
  };

  const handleQuestionChange = (index) => {
    // Save current code before switching
    if (questions[currentQuestionIndex]) {
      setSubmissions(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: code
      }));
    }

    setCurrentQuestionIndex(index);
    
    // Load saved code or template for new question
    const questionId = questions[index].id;
    const savedCode = submissions[questionId];
    setCode(savedCode || questions[index].template_code || '');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      setLoading(true);
      const response = await api.post(`/submissions/${currentQuestion.id}`, {
        code,
        language: currentQuestion.language
      });

      // Display AI scoring results
      if (response.data.score !== undefined) {
        toast.success(`Code evaluated! Score: ${response.data.score}/${response.data.maxScore}`);
        
        // Store submission result with AI feedback
        setSubmissions(prev => ({
          ...prev,
          [currentQuestion.id]: {
            code,
            score: response.data.score,
            maxScore: response.data.maxScore,
            feedback: response.data.feedback,
            status: response.data.status
          }
        }));
      } else {
        toast.success('Code submitted for testing!');
      }
      
      // Poll for results
      setTimeout(() => checkSubmissionResult(response.data.submission.id), 2000);
    } catch (error) {
      console.error('Error running code:', error);
      toast.error('Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  const handleCompile = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      setIsCompiling(true);
      const response = await api.post(`/submissions/${currentQuestion.id}`, {
        code,
        language: currentQuestion.language
      });

      // Display AI scoring results for compilation
      if (response.data.score !== undefined) {
        toast.success(`Code compiled and evaluated! Score: ${response.data.score}/${response.data.maxScore}`);
        
        // Store compilation result with AI feedback
        setCompilationStatus(prev => ({
          ...prev,
          [currentQuestion.id]: {
            score: response.data.score,
            maxScore: response.data.maxScore,
            feedback: response.data.feedback,
            status: response.data.status
          }
        }));
      } else {
        toast.info('Compiling and testing...');
      }
      
      // Poll for compilation results
      setTimeout(() => checkCompilationResult(response.data.submission.id, currentQuestion.id), 2000);
    } catch (error) {
      console.error('Error checking submission:', error);
    } finally {
      setIsCompiling(false);
    }
  };



  const checkCompilationResult = async (submissionId, questionId) => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
      const submission = response.data.submission;
      
      if (submission.status === 'completed') {
        const passed = submission.passed_tests === submission.total_tests;
        setCompilationStatus(prev => ({
          ...prev,
          [questionId]: passed ? 'success' : 'error'
        }));
        
        setTestResults(prev => ({
          ...prev,
          [questionId]: {
            passed: submission.passed_tests,
            total: submission.total_tests,
            output: submission.output,
            error: submission.error
          }
        }));

        if (passed) {
          toast.success(`All tests passed! (${submission.passed_tests}/${submission.total_tests})`);
        } else {
          toast.error(`Tests failed: ${submission.passed_tests}/${submission.total_tests} passed`);
        }
      } else if (submission.status === 'error') {
        setCompilationStatus(prev => ({
          ...prev,
          [questionId]: 'error'
        }));
        toast.error('Compilation error: ' + (submission.error || 'Unknown error'));
      } else {
        // Still processing, check again
        setTimeout(() => checkCompilationResult(submissionId, questionId), 2000);
      }
    } catch (error) {
      console.error('Error checking compilation result:', error);
      setCompilationStatus(prev => ({
        ...prev,
        [questionId]: 'error'
      }));
      toast.error('Failed to check compilation result');
    }
  };

  const checkSubmissionResult = async (submissionId) => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
      const submission = response.data.submission;
      
      if (submission.status === 'pending' || submission.status === 'running') {
        // Still processing, check again
        setTimeout(() => checkSubmissionResult(submissionId), 1000);
        return;
      }

      // Add to recent submissions for notifications
      setRecentSubmissions(prev => [submission, ...prev.slice(0, 4)]);
      
      if (submission.status === 'passed') {
        toast.success(`✅ All tests passed! Score: ${submission.score}%`);
      } else if (submission.status === 'failed') {
        const results = JSON.parse(submission.test_results || '[]');
        const passedTests = results.filter(r => r.passed).length;
        toast.error(`❌ ${passedTests}/${results.length} tests passed. Score: ${submission.score}%`);
      } else {
        toast.error('Code execution failed');
      }
    } catch (error) {
      console.error('Error checking submission result:', error);
      toast.error('Failed to check submission result');
    }
  };
  
  const handleSaveProgress = async () => {
    try {
      // Save current code for the current question
      const updatedCodes = [...userCodes];
      updatedCodes[currentQuestionIndex] = code;
      setUserCodes(updatedCodes);
      
      // Here you would typically save to backend
      // For now, just show success message
      toast.success('Progress saved!');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionChange(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionChange(currentQuestionIndex + 1);
    }
  };

  const handleSubmitAssessment = async (isAutoSubmit = false) => {
    try {
      setIsRunning(false);
      
      // Submit all saved submissions to backend
      const allSubmissions = { ...submissions };
      
      // Include current code if not already saved
      if (code.trim()) {
        const currentQuestion = questions[currentQuestionIndex];
        allSubmissions[currentQuestion.id] = code;
      }

      // Submit each question's code
      const submissionPromises = Object.entries(allSubmissions).map(async ([questionId, questionCode]) => {
        const question = questions.find(q => q.id == questionId);
        if (question && questionCode) {
          return api.post(`/submissions/${questionId}`, {
            code: questionCode,
            language: question.language,
            assessment_id: assessmentId,
            is_final: true
          });
        }
      });

      await Promise.all(submissionPromises.filter(Boolean));

      // Trigger AI scoring for the entire assessment
      try {
        await api.post(`/assessments/${assessmentId}/finalize`, {
          auto_submit: isAutoSubmit
        });
        toast.success(isAutoSubmit ? 'Assessment auto-submitted and scored!' : 'Assessment submitted and scored!');
      } catch (scoringError) {
        console.error('Error triggering AI scoring:', scoringError);
        toast.success(isAutoSubmit ? 'Assessment auto-submitted!' : 'Assessment submitted!');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions found for this assessment.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentCompilationStatus = compilationStatus[currentQuestion.id];
  const currentTestResult = testResults[currentQuestion.id];
  
  // Determine border color based on compilation status
  const getBorderClass = () => {
    if (currentCompilationStatus === 'success') return 'border-green-500 border-2';
    if (currentCompilationStatus === 'error') return 'border-red-500 border-2';
    return 'border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{assessment.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-500 ${
                timeLeft < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 
                timeLeft < 600 ? 'bg-yellow-100 text-yellow-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                <Clock className={`h-4 w-4 ${
                  timeLeft < 300 ? 'animate-bounce' : ''
                }`} />
                <span className="font-mono font-medium text-lg">{formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={handleSubmitAssessment}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 mb-4">Questions</h3>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionChange(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      index === currentQuestionIndex
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : submissions[question.id]
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Q{index + 1}</div>
                    <div className="text-xs opacity-75">{question.language}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentQuestion.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {currentQuestion.language}
                    </span>
                    <span>Max Score: {currentQuestion.max_score || 100}</span>
                    <span>Time Limit: {currentQuestion.time_limit || 30} min</span>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.description }} />
                </div>
              </div>

              {/* Code Editor */}
              <div className={`bg-white rounded-lg shadow p-6 transition-all duration-300 ${getBorderClass()}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">Code Editor</h3>
                    {currentCompilationStatus === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {currentCompilationStatus === 'error' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProgress}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center space-x-1"
                    >
                      <Save className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCompile}
                      disabled={isCompiling}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Play className="h-3 w-3" />
                      <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
                    </button>
                    <button
                      onClick={handleRunCode}
                      disabled={loading}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Play className="h-3 w-3" />
                      <span>{loading ? 'Running...' : 'Run & Test'}</span>
                    </button>
                  </div>
                </div>
                
                <CodeEditor
                  language={currentQuestion.language}
                  initialCode={code}
                  onCodeChange={setCode}
                  onSubmit={handleRunCode}
                  isSubmitting={loading}
                  disableCopyPaste={true}
                  hideToolbar={true}
                />
                
                {/* Test Results Display */}
                {currentTestResult && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    currentCompilationStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="text-sm font-medium mb-1">
                      Test Results: {currentTestResult.passed}/{currentTestResult.total} passed
                    </div>
                    {currentTestResult.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {currentTestResult.error}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification System */}
      {showNotifications && (
        <NotificationSystem
          timeLeft={timeLeft}
          submissions={recentSubmissions}
          onDismiss={() => setShowNotifications(false)}
        />
      )}
      
      {/* Notification Bell */}
      {!showNotifications && (
        <NotificationBell
          notificationCount={recentSubmissions.length}
          onClick={() => setShowNotifications(true)}
        />
      )}
    </div>
  );
};

export default TakeAssessment;
