import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState('');
  const navigate = useNavigate();

  // Token management functions
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const clearAuthData = () => {
    // Clear all authentication related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    // Clear any other auth-related data you might have
    sessionStorage.clear();
  };

  const performLogout = async () => {
    const token = getToken();
    
    if (!token) {
      // If no token, just clear data and redirect
      clearAuthData();
      redirectToLogin();
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutStatus('Logging out...');

      const response = await fetch('http://localhost:8081/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogoutStatus(data.message || 'Logout successful');
        
        // Clear all authentication data
        clearAuthData();
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          redirectToLogin();
        }, 1500);
      } else {
        // Even if logout fails on server, clear local data
        setLogoutStatus('Logout completed');
        clearAuthData();
        setTimeout(() => {
          redirectToLogin();
        }, 1500);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local data
      setLogoutStatus('Logout completed');
      clearAuthData();
      setTimeout(() => {
        redirectToLogin();
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const redirectToLogin = () => {
    // Clear browser history to prevent going back
    window.history.replaceState(null, '', '/auth/signin');
    
    // Navigate to login page
    navigate('/auth/signin', { replace: true });
    
    // Additional security: prevent back navigation
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, '', '/auth/signin');
    });
  };

  // Prevent back navigation after logout
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', function(event) {
        window.history.pushState(null, '', '/auth/signin');
      });
    };

    // Add event listener when component mounts
    preventBack();

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

  // Auto-logout when component mounts
  useEffect(() => {
    performLogout();
  }, []);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <div className="logout-icon">
          {isLoggingOut ? (
            <div className="logout-spinner"></div>
          ) : (
            <div className="logout-success-icon">✓</div>
          )}
        </div>
        
        <div className="logout-message">
          <h2>
            {isLoggingOut ? 'Logging Out...' : 'Logged Out Successfully'}
          </h2>
          <p className="logout-status">
            {logoutStatus || 'Please wait while we securely log you out.'}
          </p>
        </div>

        <div className="logout-info">
          <p>You will be redirected to the login page shortly.</p>
          <div className="logout-progress">
            <div className="progress-bar">
              <div className={`progress-fill ${!isLoggingOut ? 'complete' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="logout-actions">
          <button 
            className="manual-redirect-btn"
            onClick={redirectToLogin}
            disabled={isLoggingOut}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;