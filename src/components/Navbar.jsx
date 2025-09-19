import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../utils/auth';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of UPCHAARAK.",
    });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠', number: 1 },
    { path: '/chat', label: 'Chat', icon: '💬', number: 2 },
    { path: '/history', label: 'History', icon: '📋', number: 3 },
    { path: '/booking', label: 'Booking', icon: '📅', number: 4 },
    { path: '/LocalHospitals', label: 'Local Hospitals', icon: '🏥', number: 5 }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle number keys when not in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const number = parseInt(e.key);
      if (number >= 1 && number <= navLinks.length) {
        const targetLink = navLinks.find(link => link.number === number);
        if (targetLink) {
          navigate(targetLink.path);
          toast({
            title: `Navigated to ${targetLink.label}`,
            description: `Switched to page ${number}: ${targetLink.label}`,
          });
        }
      }

      // Handle arrow key navigation
      const currentIndex = navLinks.findIndex(link => link.path === location.pathname);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        const targetLink = navLinks[currentIndex - 1];
        navigate(targetLink.path);
        toast({
          title: `◀ Previous: ${targetLink.label}`,
          description: `Navigated to page ${targetLink.number}`,
        });
      } else if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
        e.preventDefault();
        const targetLink = navLinks[currentIndex + 1];
        navigate(targetLink.path);
        toast({
          title: `▶ Next: ${targetLink.label}`,
          description: `Navigated to page ${targetLink.number}`,
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, location.pathname]);

  const handleNumberClick = (link) => {
    navigate(link.path);
    toast({
      title: `Navigated to ${link.label}`,
      description: `Switched to page ${link.number}: ${link.label}`,
    });
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-medical-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">UPCHAARAK</h1>
              <p className="text-xs text-muted-foreground -mt-1">AI Health Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isActive(link.path)
                    ? 'bg-primary-foreground text-primary border-primary-foreground'
                    : 'bg-primary text-primary-foreground border-primary'
                }`}>
                  {link.number}
                </div>
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Quick Number Navigation */}
          <div className="hidden lg:flex items-center space-x-2 mx-4">
            <span className="text-xs text-muted-foreground font-medium">Quick Nav:</span>
            {navLinks.map((link) => (
              <button
                key={`quick-${link.path}`}
                onClick={() => handleNumberClick(link)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 transform hover:scale-110 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                }`}
                title={`Press ${link.number} to go to ${link.label}`}
              >
                {link.number}
              </button>
            ))}
          </div>

          {/* User Menu & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              <p className="text-foreground font-medium">Welcome, {user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-accent text-sm px-4 py-2"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-3 space-y-2">
            {/* User Info */}
            <div className="pb-3 border-b border-border">
              <p className="text-foreground font-medium">{user?.name}</p>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isActive(link.path)
                    ? 'bg-primary-foreground text-primary border-primary-foreground'
                    : 'bg-primary text-primary-foreground border-primary'
                }`}>
                  {link.number}
                </div>
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Quick Number Navigation for Mobile */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium mb-2 px-3">Quick Navigation:</p>
              <div className="flex justify-center space-x-2">
                {navLinks.map((link) => (
                  <button
                    key={`mobile-quick-${link.path}`}
                    onClick={() => {
                      handleNumberClick(link);
                      setIsMenuOpen(false);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                    title={`Go to ${link.label}`}
                  >
                    {link.number}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Tip: Press 1-4 keys to navigate quickly
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;