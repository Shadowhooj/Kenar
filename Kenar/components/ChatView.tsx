import React, { useState, useEffect, useRef } from 'react';
import type { User, Chat, Message } from '../types';
import { BackIcon, SendIcon, CameraIcon } from './icons';

interface ChatViewProps {
  user: User;
  chat: Chat;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onRemoveMessage: (messageId: string) => void;
  onNavigateToCamera: () => void;
}

const MessageItem: React.FC<{ message: Message; onExpired: () => void }> = ({ message, onExpired }) => {
    const [timeLeft, setTimeLeft] = useState(10);
  
    useEffect(() => {
      const countdownTimer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
  
      const expiryTimer = setTimeout(() => {
        onExpired();
        clearInterval(countdownTimer);
      }, 10000);
  
      return () => {
        clearInterval(countdownTimer);
        clearTimeout(expiryTimer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message.id]);
  
    const isMyMessage = message.senderId === 'me';
    const progress = (timeLeft / 10) * 100;

    return (
      <div className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
        <div className="relative max-w-xs lg:max-w-md my-1 flex flex-col">
          <div className={`${isMyMessage ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'} p-3 rounded-xl shadow-md`}>
            {message.type === 'image' ? (
                <div>
                    <img src={message.content} alt="Sent snap" className="rounded-lg max-h-64" />
                    {message.caption && <p className="pt-2 text-sm">{message.caption}</p>}
                </div>
            ) : (
                <p style={{wordBreak: 'break-word'}}>{message.content}</p>
            )}
          </div>
          {/* Timer bar */}
          <div className="h-1 mt-1 rounded-full bg-gray-600/50 w-full overflow-hidden">
             <div className="h-full bg-purple-400 transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
};

export const ChatView: React.FC<ChatViewProps> = ({ user, chat, onBack, onSendMessage, onRemoveMessage, onNavigateToCamera }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col">
      {/* AppBar */}
      <header className="bg-gray-800 p-2 flex items-center justify-between shadow-md z-10 flex-shrink-0">
        <div className="flex items-center">
            <button onClick={onBack} className="material-button text-white p-3 rounded-full">
              <BackIcon className="w-6 h-6" />
            </button>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-1" />
            <h1 className="text-lg font-medium mr-3">{user.name}</h1>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-grow p-4 overflow-y-auto" dir="ltr">
        <div className="space-y-2">
          {chat.messages.map((msg) => (
             <MessageItem key={msg.id} message={msg} onExpired={() => onRemoveMessage(msg.id)} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="p-2 bg-gray-900 border-t border-gray-700/50 flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center space-x-2 space-x-reverse">
          <button type="button" onClick={onNavigateToCamera} className="material-button p-3 text-white rounded-full">
             <CameraIcon className="w-6 h-6"/>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="پیام..."
            className="flex-grow bg-gray-800 text-white placeholder-gray-400 rounded-full px-4 py-2.5 border-2 border-transparent focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button type="submit" disabled={!inputText.trim()} className="material-button p-3 bg-purple-600 rounded-full text-white disabled:bg-gray-600 transition-colors">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};