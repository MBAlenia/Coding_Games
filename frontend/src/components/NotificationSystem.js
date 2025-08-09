import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';

const NotificationSystem = ({ timeLeft, submissions = [], onDismiss }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const newNotifications = [];

    // Time-based notifications
    if (timeLeft !== null) {
      if (timeLeft <= 300 && timeLeft > 60) { // 5 minutes warning
        newNotifications.push({
          id: 'time-warning-5',
          type: 'warning',
          title: '⏰ 5 minutes remaining!',
          message: 'Don\'t forget to submit your solutions.',
          icon: Clock,
          priority: 'medium'
        });
      } else if (timeLeft <= 60 && timeLeft > 30) { // 1 minute warning
        newNotifications.push({
          id: 'time-warning-1',
          type: 'error',
          title: '🚨 1 minute left!',
          message: 'Assessment will auto-submit soon.',
          icon: AlertTriangle,
          priority: 'high'
        });
      } else if (timeLeft <= 30 && timeLeft > 0) { // Final countdown
        newNotifications.push({
          id: 'time-critical',
          type: 'error',
          title: '⚡ Final countdown!',
          message: `${timeLeft} seconds remaining`,
          icon: AlertTriangle,
          priority: 'critical'
        });
      }
    }

    // Submission-based notifications
    submissions.forEach(submission => {
      if (submission.status === 'passed') {
        newNotifications.push({
          id: `submission-${submission.id}`,
          type: 'success',
          title: '✅ Test Passed!',
          message: `Score: ${submission.score}% - Great job!`,
          icon: CheckCircle,
          priority: 'low'
        });
      } else if (submission.status === 'failed') {
        newNotifications.push({
          id: `submission-${submission.id}`,
          type: 'warning',
          title: '❌ Some tests failed',
          message: `Score: ${submission.score}% - Keep trying!`,
          icon: AlertTriangle,
          priority: 'medium'
        });
      }
    });

    setNotifications(newNotifications);
  }, [timeLeft, submissions]);

  const getNotificationStyle = (type, priority) => {
    const baseStyle = "transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyle} bg-green-50 border-green-200 text-green-800`;
      case 'warning':
        return `${baseStyle} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'error':
        return `${baseStyle} bg-red-50 border-red-200 text-red-800`;
      default:
        return `${baseStyle} bg-blue-50 border-blue-200 text-blue-800`;
    }
  };

  const getPriorityAnimation = (priority) => {
    switch (priority) {
      case 'critical':
        return 'animate-pulse';
      case 'high':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <div
            key={notification.id}
            className={`
              ${getNotificationStyle(notification.type, notification.priority)}
              ${getPriorityAnimation(notification.priority)}
              border rounded-lg shadow-lg p-4 relative
            `}
          >
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  {notification.title}
                </p>
                <p className="text-xs mt-1 opacity-90">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => {
                  setNotifications(prev => 
                    prev.filter(n => n.id !== notification.id)
                  );
                }}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      
      {/* Notification toggle */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <Bell className="h-3 w-3" />
          <span>Hide notifications</span>
        </button>
      </div>
    </div>
  );
};

// Floating notification bell
export const NotificationBell = ({ notificationCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
    >
      <Bell className="h-5 w-5" />
      {notificationCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </button>
  );
};

export default NotificationSystem;
