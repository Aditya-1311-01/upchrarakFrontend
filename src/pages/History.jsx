import React, { useState, useEffect } from 'react';
import { getChatHistory, deleteChatEntry, clearChatHistory } from '../utils/storage';
import { toast } from '@/hooks/use-toast';
import PageNavigator from '../components/PageNavigator';

const History = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [chatHistory, searchTerm]);

  const loadHistory = () => {
    const history = getChatHistory();
    setChatHistory(history);
  };

  const filterHistory = () => {
    if (!searchTerm.trim()) {
      setFilteredHistory(chatHistory);
      return;
    }

    const filtered = chatHistory.filter((entry) =>
      entry.userMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.botResponse.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  const handleDeleteEntry = (id) => {
    try {
      deleteChatEntry(id);
      loadHistory();
      setSelectedEntry(null);
      toast({
        title: "Chat deleted",
        description: "The chat entry has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat entry.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      try {
        clearChatHistory();
        loadHistory();
        setSelectedEntry(null);
        toast({
          title: "History cleared",
          description: "All chat history has been cleared successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear chat history.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Chat History</h1>
              <p className="text-muted-foreground">
                View and manage your conversation history with UPCHAARAK AI
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                Total Conversations: {chatHistory.length}
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
                >
                  Clear All History
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="medical-card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Search conversations
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by message content..."
                className="medical-input"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-muted-foreground text-2xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No matching conversations found' : 'No chat history yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start a conversation with the AI assistant to see your history here.'
              }
            </p>
            {!searchTerm && (
              <a
                href="/chat"
                className="btn-medical inline-flex items-center space-x-2"
              >
                <span>Start Chatting</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Conversations ({filteredHistory.length})
              </h2>
              <div className="space-y-3 max-h-screen overflow-y-auto">
                {filteredHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`medical-card cursor-pointer transition-all duration-200 ${
                      selectedEntry?.id === entry.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md hover:-translate-y-0.5'
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded"
                        title="Delete conversation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="text-foreground font-medium mb-1">You asked:</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {entry.userMessage.length > 100 
                            ? entry.userMessage.substring(0, 100) + '...'
                            : entry.userMessage
                          }
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-foreground font-medium mb-1">AI responded:</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {entry.botResponse.length > 100 
                            ? entry.botResponse.substring(0, 100) + '...'
                            : entry.botResponse
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail View */}
            <div className="lg:sticky lg:top-4">
              {selectedEntry ? (
                <div className="medical-card">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Conversation Details
                    </h2>
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-sm text-muted-foreground mb-6">
                    {formatDate(selectedEntry.timestamp)}
                  </div>

                  <div className="space-y-6">
                    {/* User Message */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-medium">U</span>
                        </div>
                        <div className="font-medium text-foreground">Your Question</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg text-foreground leading-relaxed">
                        {selectedEntry.userMessage}
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-foreground text-xs font-medium">AI</span>
                        </div>
                        <div className="font-medium text-foreground">AI Response</div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-foreground leading-relaxed">
                        {selectedEntry.botResponse}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-border flex justify-end space-x-3">
                    <button
                      onClick={() => handleDeleteEntry(selectedEntry.id)}
                      className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
                    >
                      Delete Conversation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="medical-card text-center py-12">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-muted-foreground text-xl">👈</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground text-sm">
                    Click on any conversation from the list to view the complete details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Page Navigator */}
      <PageNavigator showLabels={true} position="bottom-center" />
    </div>
  );
};

export default History;