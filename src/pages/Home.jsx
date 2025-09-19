import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getUpcomingAppointments, getChatHistory } from '../utils/storage';
import PageNavigator from '../components/PageNavigator';

const Home = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const upcomingAppointments = getUpcomingAppointments();
  const chatHistory = getChatHistory();

  const features = [
    {
      icon: '🤖',
      title: 'AI Health Assistant',
      description: 'Get instant health guidance and support from our AI-powered chatbot.',
      link: '/chat',
      color: 'primary'
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description: 'Schedule appointments with healthcare professionals quickly and easily.',
      link: '/booking',
      color: 'accent'
    },
    {
      icon: '📋',
      title: 'Health History',
      description: 'Access your complete chat history and health interaction records.',
      link: '/history',
      color: 'success'
    }
  ];

  const stats = [
    {
      label: 'Chat Sessions',
      value: chatHistory.length,
      icon: '💬'
    },
    {
      label: 'Appointments',
      value: upcomingAppointments.length,
      icon: '📅'
    },
    {
      label: 'Days Active',
      value: Math.floor((Date.now() - new Date(user?.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 1,
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-3xl">U</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              UPCHAARAK
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              AI-Powered Health Assistant
            </p>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Making healthcare accessible through intelligent AI assistance. Get instant health guidance, 
              book appointments, and manage your health journey with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/chat')}
                className="bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Start Chatting Now
              </button>
              <Link
                to="/booking"
                className="border border-white/30 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105 text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Message */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Ready to take control of your health today?
          </p>
          
          {/* Navigation Help */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
            <span className="text-primary text-sm">💡</span>
            <span className="text-primary text-sm font-medium">
              Quick Tip: Press 1-4 keys or use ← → arrows to navigate between pages!
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="medical-card-hover text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="medical-card-hover group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className={`inline-flex items-center text-${feature.color} font-medium group-hover:translate-x-1 transition-transform duration-200`}>
                  Explore
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/chat"
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-medium">Start Chat</div>
                <div className="text-sm text-muted-foreground">Ask health questions</div>
              </div>
            </Link>
            <Link
              to="/booking"
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <span className="text-2xl">📅</span>
              <div>
                <div className="font-medium">Book Now</div>
                <div className="text-sm text-muted-foreground">Schedule appointment</div>
              </div>
            </Link>
            <Link
              to="/history"
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <div className="font-medium">View History</div>
                <div className="text-sm text-muted-foreground">Check past chats</div>
              </div>
            </Link>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <span className="text-2xl">🚀</span>
              <div>
                <div className="font-medium">Emergency</div>
                <div className="text-sm text-muted-foreground">Urgent consultation</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        {(upcomingAppointments.length > 0 || chatHistory.length > 0) && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <div className="medical-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center">
                    <span className="text-xl mr-2">📅</span>
                    Upcoming Appointments
                  </h4>
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                        <div className="text-success text-sm font-medium">{appointment.status}</div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/booking"
                    className="inline-flex items-center text-primary font-medium mt-4 hover:underline"
                  >
                    View all appointments
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Recent Chats */}
              {chatHistory.length > 0 && (
                <div className="medical-card">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center">
                    <span className="text-xl mr-2">💬</span>
                    Recent Conversations
                  </h4>
                  <div className="space-y-3">
                    {chatHistory.slice(0, 3).map((chat) => (
                      <div key={chat.id} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm mb-1">
                          {chat.userMessage.length > 50 
                            ? chat.userMessage.substring(0, 50) + '...'
                            : chat.userMessage
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {chat.date} at {chat.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/history"
                    className="inline-flex items-center text-primary font-medium mt-4 hover:underline"
                  >
                    View chat history
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Page Navigator */}
      <PageNavigator showLabels={true} position="bottom-right" />
    </div>
  );
};

export default Home;