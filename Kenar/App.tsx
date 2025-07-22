import React, { useState, useCallback } from 'react';
import { CameraView } from './components/CameraView';
import { ChatView } from './components/ChatView';
import { NearbyUsersView } from './components/NearbyUsersView';
import { PermissionsView } from './components/PermissionsView';
import type { User, Message, Chat } from './types';

export type View = 'permissions' | 'camera' | 'nearby' | 'chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('permissions');
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Record<string, Chat>>({});

  const handlePermissionsGranted = () => {
    setCurrentView('nearby');
  };

  const handleSelectUser = (user: User) => {
    if (!chats[user.id]) {
      setChats(prev => ({ ...prev, [user.id]: { userId: user.id, messages: [] } }));
    }
    setActiveChatUser(user);
    setCurrentView('chat');
  };

  const addMessage = useCallback((userId: string, messageContent: Pick<Message, 'type' | 'content' | 'caption'>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      ...messageContent,
      timestamp: new Date(),
    };

    setChats(prevChats => {
      const userChat = prevChats[userId] || { userId, messages: [] };
      return {
        ...prevChats,
        [userId]: {
          ...userChat,
          messages: [...userChat.messages, newMessage],
        },
      };
    });
  }, []);

  const removeMessage = useCallback((userId: string, messageId: string) => {
    setChats(prevChats => {
      const userChat = prevChats[userId];
      if (!userChat) return prevChats;

      return {
        ...prevChats,
        [userId]: {
          ...userChat,
          messages: userChat.messages.filter(msg => msg.id !== messageId),
        },
      };
    });
  }, []);
  
  const handleSendPhoto = (photoDataUrl: string, caption: string) => {
    if (activeChatUser) {
      addMessage(activeChatUser.id, {
        type: 'image',
        content: photoDataUrl,
        caption: caption,
      });
      setCurrentView('chat');
    } else {
      // If no chat is active, go to nearby to select a user first
      // This is a fallback, UI should ideally guide user to select someone first
      alert("لطفا ابتدا یک مخاطب برای ارسال انتخاب کنید.");
      setCurrentView('nearby');
    }
  };


  const renderView = () => {
    switch (currentView) {
      case 'permissions':
        return <PermissionsView onGranted={handlePermissionsGranted} />;
      case 'nearby':
        return <NearbyUsersView onSelectUser={handleSelectUser} onNavigateToCamera={() => setCurrentView('camera')} />;
      case 'chat':
        if (activeChatUser) {
          return (
            <ChatView
              user={activeChatUser}
              chat={chats[activeChatUser.id] || { userId: activeChatUser.id, messages: [] }}
              onBack={() => {
                setActiveChatUser(null);
                setCurrentView('nearby'); // Go back to radar screen from chat
              }}
              onSendMessage={(text) => addMessage(activeChatUser.id, { type: 'text', content: text })}
              onRemoveMessage={(messageId) => removeMessage(activeChatUser.id, messageId)}
              onNavigateToCamera={() => setCurrentView('camera')}
            />
          );
        }
        // Fallback if no user is selected
        setCurrentView('nearby');
        return null;
      case 'camera':
      default:
        return <CameraView onNavigateToNearby={() => setCurrentView('nearby')} onSendPhoto={handleSendPhoto} hasActiveChat={!!activeChatUser} activeChatUser={activeChatUser}/>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {renderView()}
    </div>
  );
};

export default App;