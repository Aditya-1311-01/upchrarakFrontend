import React from 'react';

const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary ml-2' : 'bg-muted mr-2'
        }`}>
          {isUser ? (
            <span className="text-primary-foreground text-sm font-medium">U</span>
          ) : (
            <span className="text-foreground text-sm font-medium">AI</span>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          {/* Message Bubble */}
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'chat-bubble-user bg-primary text-primary-foreground rounded-br-md' 
              : 'chat-bubble-bot bg-muted text-foreground rounded-bl-md'
          } shadow-sm`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>

          {/* Timestamp */}
          {timestamp && (
            <div className={`text-xs text-muted-foreground mt-1 px-2 ${
              isUser ? 'text-right' : 'text-left'
            }`}>
              {new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;