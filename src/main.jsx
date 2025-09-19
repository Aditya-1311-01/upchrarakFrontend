import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Initialize demo user and data on first load
const initializeDemoData = () => {
  // Check if demo user already exists
  const users = JSON.parse(localStorage.getItem('upchaarak_users') || '[]');
  const demoUser = users.find(user => user.email === 'demo@upchaarak.com');
  
  if (!demoUser) {
    // Add demo user
    const newDemoUser = {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@upchaarak.com',
      password: 'demo123',
      createdAt: new Date().toISOString()
    };
    users.push(newDemoUser);
    localStorage.setItem('upchaarak_users', JSON.stringify(users));
  }

  // Add some demo chat history if none exists
  const chatHistory = JSON.parse(localStorage.getItem('upchaarak_chat_history') || '[]');
  if (chatHistory.length === 0) {
    const demoChatHistory = [
      {
        id: 'demo-chat-1',
        userMessage: 'What are the common symptoms of flu?',
        botResponse: 'Common flu symptoms include fever, body aches, fatigue, cough, sore throat, runny nose, and headaches. Symptoms typically develop 1-4 days after exposure to the virus and can last 5-7 days. If symptoms worsen or persist beyond a week, please consult a healthcare professional.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        date: new Date().toLocaleDateString(),
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString()
      },
      {
        id: 'demo-chat-2',
        userMessage: 'How can I improve my sleep quality?',
        botResponse: 'To improve sleep quality: 1) Maintain a consistent sleep schedule, 2) Create a relaxing bedtime routine, 3) Keep your bedroom cool, dark, and quiet, 4) Limit screen time before bed, 5) Avoid caffeine and large meals near bedtime, 6) Exercise regularly but not close to bedtime. If sleep problems persist, consider consulting a sleep specialist.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString()
      }
    ];
    localStorage.setItem('upchaarak_chat_history', JSON.stringify(demoChatHistory));
  }

  // Add demo appointments if none exist
  const appointments = JSON.parse(localStorage.getItem('upchaarak_appointments') || '[]');
  if (appointments.length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const demoAppointments = [
      {
        id: 'demo-appointment-1',
        patientName: 'Demo User',
        age: 28,
        symptoms: 'Regular health checkup and wellness consultation',
        date: tomorrow.toISOString().split('T')[0], // Tomorrow's date
        time: '10:00',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        createdDate: new Date().toLocaleDateString(),
        createdTime: new Date().toLocaleTimeString()
      }
    ];
    localStorage.setItem('upchaarak_appointments', JSON.stringify(demoAppointments));
  }
};

// Initialize demo data
initializeDemoData();

createRoot(document.getElementById("root")).render(<App />);