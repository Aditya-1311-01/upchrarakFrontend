import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(formData);
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Sign in to your UPCHAARAK account</p>
        </div>

        {/* Login Form */}
        <div className="medical-card bg-white/10 backdrop-blur-sm border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="medical-input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="medical-input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/10 text-white/80 backdrop-blur-sm rounded">
                  New to UPCHAARAK?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="w-full block text-center border border-white/30 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm mb-2">Demo Credentials:</p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
            <p className="text-white/80 text-xs">
              <strong>Email:</strong> demo@upchaarak.com<br />
              <strong>Password:</strong> demo123
            </p>
          </div>
          
          {/* Navigation Tips */}
          <div className="mt-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-3">
            <p className="text-primary text-xs font-medium mb-2">🚀 Navigation Features:</p>
            <div className="space-y-1 text-xs text-primary/80">
              <p>• Press keys 1-4 to jump between pages instantly</p>
              <p>• Use ← → arrow keys for sequential navigation</p>
              <p>• Click numbered buttons in navigation bars</p>
              <p>• Floating page navigator on each page</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            By signing in, you agree to our{' '}
            <a href="#" className="text-white underline hover:text-white/80">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-white underline hover:text-white/80">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;