import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const PageNavigator = ({ showLabels = false, position = 'bottom-right' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { path: '/', label: 'Home', icon: '🏠', number: 1, shortcut: '1' },
    { path: '/chat', label: 'Chat', icon: '💬', number: 2, shortcut: '2' },
    { path: '/history', label: 'History', icon: '📋', number: 3, shortcut: '3' },
    { path: '/booking', label: 'Booking', icon: '📅', number: 4, shortcut: '4' }
  ];

  const currentPage = pages.find(page => page.path === location.pathname);
  const currentPageIndex = pages.findIndex(page => page.path === location.pathname);

  const navigateToPage = (page) => {
    navigate(page.path);
    toast({
      title: `Switched to ${page.label}`,
      description: `Now viewing page ${page.number}: ${page.label}`,
    });
  };

  const navigatePrevious = () => {
    if (currentPageIndex > 0) {
      navigateToPage(pages[currentPageIndex - 1]);
    }
  };

  const navigateNext = () => {
    if (currentPageIndex < pages.length - 1) {
      navigateToPage(pages[currentPageIndex + 1]);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-40 flex flex-col space-y-3`}>
      {/* Page Indicator */}
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        {showLabels && currentPage && (
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-foreground">
              {currentPage.icon} {currentPage.label}
            </div>
            <div className="text-xs text-muted-foreground">
              Page {currentPage.number} of {pages.length}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={navigatePrevious}
            disabled={currentPageIndex === 0}
            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {pages.map((page) => (
              <button
                key={page.path}
                onClick={() => navigateToPage(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 transform hover:scale-110 ${
                  location.pathname === page.path
                    ? 'bg-primary text-primary-foreground shadow-md scale-110'
                    : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
                title={`${page.label} (Press ${page.shortcut})`}
              >
                {page.number}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={navigateNext}
            disabled={currentPageIndex === pages.length - 1}
            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="Next page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="text-center mt-3 pt-3 border-border">
          <div className="text-xs text-muted-foreground">
            Press 1-{pages.length} or use ← → keys
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNavigator;