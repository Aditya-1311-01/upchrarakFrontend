import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import { addChatMessage, getChatHistory } from '../utils/storage';
import { toast } from '@/hooks/use-toast';
import PageNavigator from '../components/PageNavigator';

// // Placeholder function for future API integration
// const fetchBotResponse = async (message) => {
//   // This function will be replaced with actual API call in the future
//   // For now, return a placeholder response
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const responses = [
//         "Thank you for your question. I understand your concern about your health. Based on what you've shared, I recommend consulting with a healthcare professional for a proper evaluation.",
//         "I'm here to help with your health concerns. However, for accurate diagnosis and treatment, please consider booking an appointment with a qualified doctor through our booking system.",
//         "Your health is important to us. While I can provide general guidance, it's always best to get professional medical advice for specific symptoms or conditions.",
//         "I appreciate you reaching out. For the symptoms you've described, I'd suggest monitoring them closely and seeking medical attention if they persist or worsen.",
//         "Thank you for sharing this with me. Based on general medical knowledge, I'd recommend keeping track of your symptoms and discussing them with a healthcare provider."
//       ];
//       const randomResponse = responses[Math.floor(Math.random() * responses.length)];
//       resolve(randomResponse);
//     }, 1000 + Math.random() * 2000); // Simulate API delay
//   });
// };


// Replace placeholder with real API call
// const fetchBotResponse = async (message) => {
//   try {
//     const response = await fetch(import.meta.env.VITE_API_URL, {

//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`, // if your API uses Bearer tokens
//       },
//       body: JSON.stringify({
//         message: message,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("API request failed");
//     }

//     const data = await response.json();

//     // Adjust depending on API response structure
//     return data.reply || data.message || "No response from AI.";
//   } catch (error) {
//     console.error("Error fetching bot response:", error);
//     throw error;
//   }
// };


const fetchBotResponse = async (message) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // Gemini returns text in `candidates[0].content.parts[0].text`
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (error) {
    console.error("Error fetching bot response:", error);
    throw error;
  }
};



const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const history = getChatHistory();
    const formattedMessages = [];
    
    history.slice(0, 20).reverse().forEach((entry) => { // Show last 20 conversations
      formattedMessages.push({
        id: `user-${entry.id}`,
        message: entry.userMessage,
        isUser: true,
        timestamp: entry.timestamp
      });
      formattedMessages.push({
        id: `bot-${entry.id}`,
        message: entry.botResponse,
        isUser: false,
        timestamp: entry.timestamp
      });
    });
    
    setMessages(formattedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: `user-${Date.now()}`,
      message: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Get bot response
      const botResponse = await fetchBotResponse(userMessage);
      
      // Add bot message to chat
      const newBotMessage = {
        id: `bot-${Date.now()}`,
        message: botResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newBotMessage]);

      // Save to localStorage
      addChatMessage(userMessage, botResponse);

      toast({
        title: "Message sent",
        description: "AI response received successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });

      // Add error message
      const errorMessage = {
        id: `bot-error-${Date.now()}`,
        message: "I'm sorry, I'm having trouble responding right now. Please try again later or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "Current conversation has been cleared.",
    });
  };

  const quickQuestions = [
    "What are the symptoms of common flu?",
    "How can I improve my sleep quality?",
    "What's a healthy diet for weight management?",
    "When should I see a doctor for a headache?",
    "How to manage stress and anxiety?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">UPCHAARAK AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                {isTyping ? "AI is typing..." : "Online • Ready to help"}
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">🤖</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to UPCHAARAK AI Assistant
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  I'm here to help with your health questions and concerns. 
                  Ask me anything about symptoms, wellness, or general health guidance.
                </p>
                
                {/* Quick Questions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground mb-3">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-1">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-end space-x-2 max-w-xs">
                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-foreground text-sm font-medium">AI</span>
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-card border-t border-border px-4 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health concerns..."
                  rows={1}
                  className="w-full medical-input resize-none max-h-32 min-h-[44px]"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This AI assistant provides general health information. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Page Navigator */}
      <PageNavigator position="bottom-left" />
    </div>
  );
};

export default Chat;