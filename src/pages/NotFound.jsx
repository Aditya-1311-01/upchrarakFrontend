import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-primary text-4xl">🏥</span>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-medical inline-flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Go Home</span>
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Or try one of these helpful links:
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/chat"
              className="text-primary hover:text-primary-dark underline text-sm"
            >
              AI Chat
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/booking"
              className="text-primary hover:text-primary-dark underline text-sm"
            >
              Book Appointment
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/history"
              className="text-primary hover:text-primary-dark underline text-sm"
            >
              Chat History
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">
            <strong>Need help?</strong> If you believe this is an error, please contact our support team.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;