import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/auth';
import { toast } from '@/hooks/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Password and confirm password do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const user = signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast({
        title: "Account created successfully!",
        description: `Welcome to UPCHAARAK, ${user.name}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Signup failed",
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
          <h1 className="text-3xl font-bold text-white mb-2">Join UPCHAARAK</h1>
          <p className="text-white/80">Create your account for AI-powered healthcare</p>
        </div>

        {/* Signup Form */}
        <div className="medical-card bg-white/10 backdrop-blur-sm border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="medical-input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30"
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="medical-input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30"
                placeholder="Confirm your password"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 border border-white/30 rounded bg-white/20 focus:ring-2 focus:ring-white/50"
              />
              <label htmlFor="terms" className="text-white/80 text-sm">
                I agree to the{' '}
                <a href="#" className="text-white underline hover:text-white/80">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-white underline hover:text-white/80">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
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
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            to="/login"
            className="w-full block text-center border border-white/30 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 text-center">Why Choose UPCHAARAK?</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <span className="text-success">✓</span>
                <span>24/7 AI-powered health assistance</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <span className="text-success">✓</span>
                <span>Easy appointment booking</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <span className="text-success">✓</span>
                <span>Secure health history tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;