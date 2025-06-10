
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth, useChat, useUserManagement, useSettings } from './store';
import { Avatar, Button, Input, Modal, CogIcon, UsersIcon, ChatBubbleIcon, SearchIcon, PaperClipIcon, FaceSmileIcon, PaperAirplaneIcon, EyeIcon, PlusIcon, ThumbsUpIcon, LoadingSpinner, ArrowLeftIcon } from './ui';
import { User, Chat, Message, MessageType, UserStatus } from './types';
import { formatTimestamp } from './utils';
import { AVATAR_COLORS, APP_NAME, UNKNOWN_USER_PLACEHOLDER } from './constants';
import ProfilePage from './ProfilePage'; 

interface ChatPageProps {
  initialView?: 'chats' | 'contacts' | 'search';
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; hasNotification?: boolean }> = ({ icon, label, isActive, onClick, hasNotification }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`w-full flex flex-col items-center p-3 rounded-lg transition-colors duration-150 relative ${
      isActive ? 'bg-primary-500 text-white' : 'text-secondary-500 hover:bg-secondary-200 dark:text-secondary-400 dark:hover:bg-secondary-700'
    }`}
  >
    {icon}
    <span className="text-xs mt-1 sr-only md:not-sr-only">{label}</span>
    {hasNotification && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-secondary-800"></span>}
  </button>
);

const Sidebar: React.FC<{ 
    activeView: string; 
    onViewChange: (view: 'chats' | 'contacts' | 'search' | 'settings' | 'profile') => void;
    onUserLogout: () => void; // Renamed to avoid potential conflicts
    currentUser: User | null;
}> = ({ activeView, onViewChange, onUserLogout, currentUser }) => {
  const navigate = useNavigate();
  // const { theme, toggleTheme } = useSettings(); // toggleTheme might not be needed if settings page handles it.

  return (
    <div className="w-16 md:w-20 bg-secondary-50 dark:bg-secondary-800 h-full flex flex-col justify-between items-center p-2 md:p-3 shadow-lg">
      <div>
        {currentUser && (
          <button onClick={() => onViewChange('profile')} title="Edit Profile" aria-label="Edit Profile" className="mb-6">
            <Avatar user={currentUser} size="md" />
          </button>
        )}
        <nav className="space-y-3">
          <NavItem icon={<ChatBubbleIcon />} label="Chats" isActive={activeView === 'chats'} onClick={() => onViewChange('chats')} hasNotification={false} />
          <NavItem icon={<UsersIcon />} label="Contacts" isActive={activeView === 'contacts'} onClick={() => onViewChange('contacts')} />
          <NavItem icon={<SearchIcon />} label="Search" isActive={activeView === 'search'} onClick={() => onViewChange('search')} />
        </nav>
      </div>
      <div className="space-y-3">
        <NavItem icon={<CogIcon />} label="Settings" isActive={activeView === 'settings'} onClick={() => navigate('/settings')} />
        <Button variant="ghost" onClick={onUserLogout} className="w-full text-secondary-500 hover:text-red-500" title="Logout" aria-label="Logout">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
           </svg>
        </Button>
      </div>
    </div>
  );
};

const ChatListItem: React.FC<{ chat: Chat; isActive: boolean; onClick: () => void; currentUser: User | null }> = ({ chat, isActive, onClick, currentUser }) => {
  const { getUserById } = useUserManagement();
  if (!currentUser) return null;
  
  const otherUsersInChat = chat.participants.filter(p => p.userId !== currentUser.id);
  const otherParticipantEntry = otherUsersInChat[0]; 

  let displayUser: Pick<User, 'name' | 'nickname' | 'avatarUrl' | 'avatarBgColor'> | typeof UNKNOWN_USER_PLACEHOLDER;
  
  if (otherParticipantEntry) {
      const foundUser = getUserById(otherParticipantEntry.userId);
      // If the other user is deleted, foundUser will be undefined.
      // Use UNKNOWN_USER_PLACEHOLDER, but try to preserve nickname from participant entry.
      // The name field might be chat.name for groups, but for 1-on-1, it's better to rely on user details.
      displayUser = foundUser 
          ? foundUser 
          : { 
              ...UNKNOWN_USER_PLACEHOLDER, 
              name: otherParticipantEntry.nickname || UNKNOWN_USER_PLACEHOLDER.name, // Use nickname as name if user deleted
              nickname: otherParticipantEntry.nickname || UNKNOWN_USER_PLACEHOLDER.nickname 
            };
  } else if (chat.isGroup && chat.name) { // Group chat specific logic
      displayUser = { 
        name: chat.name, 
        nickname: "Group", 
        avatarBgColor: AVATAR_COLORS[chat.id.charCodeAt(0) % AVATAR_COLORS.length] 
      };
  } else { // Fallback for other cases (e.g. chat with no other valid participant, or group without a name)
      displayUser = UNKNOWN_USER_PLACEHOLDER;
  }
  // Corrected the syntax error and ensured displayUser is always assigned.
  // The misplaced curly brace has been removed by this restructuring.

  const lastMessageText = chat.lastMessage?.type === MessageType.Image ? '📷 Image' 
                        : chat.lastMessage?.type === MessageType.File ? '📄 File'
                        : chat.lastMessage?.type === MessageType.Like ? '👍 Liked'
                        : chat.lastMessage?.text || (displayUser === UNKNOWN_USER_PLACEHOLDER ? 'Chat with unknown user' : 'No messages yet');

  const isDisabled = displayUser === UNKNOWN_USER_PLACEHOLDER && !chat.isGroup;


  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`w-full flex items-center p-3 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-150 rounded-lg ${
        isActive && !isDisabled ? 'bg-primary-100 dark:bg-primary-700' : ''
      } ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-label={`Chat with ${displayUser?.name || displayUser?.nickname}`}
    >
      <Avatar user={displayUser} size="md" />
      <div className="ml-3 flex-1 min-w-0 text-left">
        <p className={`font-semibold truncate text-secondary-800 dark:text-secondary-100 ${isActive && !isDisabled ? 'text-primary-700 dark:text-primary-100' : ''}`}>{displayUser?.name || displayUser?.nickname}</p>
        <p className={`text-xs text-secondary-500 dark:text-secondary-400 truncate ${isActive && !isDisabled ? 'text-primary-600 dark:text-primary-300' : ''}`}>{lastMessageText}</p>
      </div>
      <div className="ml-2 flex flex-col items-end">
        <span className="text-xs text-secondary-400 dark:text-secondary-500">{formatTimestamp(chat.lastMessage?.timestamp, 'time')}</span>
        {chat.unreadCount && chat.unreadCount > 0 && !isDisabled && (
          <span className="mt-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{chat.unreadCount}</span>
        )}
      </div>
    </button>
  );
};

const ChatList: React.FC<{onContactSelect: (userId: string) => void;}> = ({onContactSelect}) => {
  const { chats, activeChatId, setActiveChatId } = useChat();
  const { currentUser } = useAuth();
  const { getUserById } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => {
    if (!currentUser) return false;
    const otherParticipant = chat.participants.find(p => p.userId !== currentUser.id);
    // If it's a group chat, it's always valid for filtering by name
    if (chat.isGroup) {
        return chat.name ? chat.name.toLowerCase().includes(searchTerm.toLowerCase()) : true; // show unnamed groups if search is empty
    }
    // For 1-on-1 chats
    if (otherParticipant) {
        const otherUserDetails = getUserById(otherParticipant.userId);
        if (otherUserDetails) { // If other user exists
            return otherUserDetails.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   otherUserDetails.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        // If other user is deleted, their details aren't available for search, but chat might still be listed
        // Let's filter them out if searchTerm is present, or show if search is empty.
        // Or use participant's stored nickname
        return otherParticipant.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false; // Should not happen for valid 1-on-1 chats with current user
  });
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-secondary-200 dark:border-secondary-700 flex flex-col h-full bg-white dark:bg-secondary-800">
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-100">Chats</h2>
        <Input 
            type="search" 
            placeholder="Search chats..." 
            aria-label="Search chats"
            className="mt-2 w-full" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            wrapperClassName="mb-0"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <ChatListItem 
              key={chat.id} 
              chat={chat} 
              isActive={activeChatId === chat.id} 
              onClick={() => handleSelectChat(chat.id)}
              currentUser={currentUser}
            />
          ))
        ) : (
          <p className="p-4 text-center text-secondary-500 dark:text-secondary-400">No chats found. Start a new conversation!</p>
        )}
      </div>
       <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
         <Button variant="primary" className="w-full" onClick={() => onContactSelect('')} leftIcon={<PlusIcon/>}>New Chat</Button>
       </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; isSender: boolean; senderUser?: User | typeof UNKNOWN_USER_PLACEHOLDER | null }> = ({ message, isSender, senderUser }) => {
  const bubbleColor = isSender ? 'bg-primary-500 text-white' : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-100';
  const alignment = isSender ? 'ml-auto' : 'mr-auto';
  const displaySender = senderUser || UNKNOWN_USER_PLACEHOLDER;
  
  const handleReply = () => {
    console.log("Replying to message:", message.id);
    alert(`Replying to: "${message.text?.substring(0,20)}..." (Feature needs full input integration)`);
  };

  return (
    <div className={`flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
        {!isSender && <Avatar user={displaySender} size="sm" className="mr-2 mt-auto shrink-0" />}
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${bubbleColor} ${alignment}`}>
        {!isSender && <p className="text-xs font-semibold mb-0.5 opacity-80">{displaySender.nickname}</p>}
        {message.type === MessageType.Image && message.text && (
            <img src={message.text} alt="Sent content" className="rounded-md max-w-full h-auto my-1 max-h-60 object-contain" />
        )}
        {message.type === MessageType.File && message.text && (
            <a href="#" onClick={(e)=>e.preventDefault()} className="flex items-center space-x-2 p-2 bg-opacity-20 bg-black rounded-md hover:bg-opacity-30">
                <PaperClipIcon className="w-5 h-5"/> <span>{message.text}</span>
            </a>
        )}
        {message.type === MessageType.Text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
        {message.type === MessageType.Like && <p className="text-3xl">👍</p>}

        <div className="flex justify-end items-center mt-1">
            <span className="text-xs opacity-70 mr-2">{formatTimestamp(message.timestamp, 'time')}</span>
            {!isSender && (
                <button onClick={handleReply} className="text-xs opacity-70 hover:opacity-100" aria-label="Reply to message">Reply</button>
            )}
        </div>
        </div>
        {isSender && <div className="w-8 shrink-0"></div>}
    </div>
  );
};

const MessageInput: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [text, setText] = useState('');
  const { sendMessage } = useChat();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSend = async () => {
    if (text.trim() === '') return;
    await sendMessage(chatId, text.trim(), MessageType.Text);
    setText('');
  };
  
  const handleLike = async () => {
     await sendMessage(chatId, '👍', MessageType.Like);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '😢'];
  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" title="Attach File" aria-label="Attach File" onClick={() => alert('File attachment not implemented.')}>
          <PaperClipIcon />
        </Button>
        <div className="relative">
            <Button variant="ghost" title="Emoji" aria-label="Insert Emoji" onClick={() => setIsEmojiPickerOpen(prev => !prev)}>
            <FaceSmileIcon />
            </Button>
            {isEmojiPickerOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-10">
                {emojis.map(emoji => (
                <button key={emoji} onClick={() => addEmoji(emoji)} className="p-1 text-xl hover:bg-secondary-100 dark:hover:bg-secondary-600 rounded" aria-label={`Insert ${emoji} emoji`}>
                    {emoji}
                </button>
                ))}
            </div>
            )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          aria-label="Message input"
          className="flex-1 p-2.5 border border-secondary-300 dark:border-secondary-600 rounded-lg resize-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-secondary-50 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 custom-scrollbar"
          rows={1}
          style={{maxHeight: '100px', overflowY: 'auto'}}
        />
        <Button variant="ghost" title="Like" aria-label="Send a like" onClick={handleLike}>
          <ThumbsUpIcon />
        </Button>
        <Button variant="primary" title="Send" aria-label="Send message" onClick={handleSend} disabled={!text.trim()}>
          <PaperAirplaneIcon />
        </Button>
      </div>
    </div>
  );
};

const MessageArea: React.FC = () => {
  const { activeChatId, messages, fetchMessages, getChatById } = useChat();
  const { currentUser } = useAuth();
  const { getUserById } = useUserManagement();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  
  const activeChat = activeChatId ? getChatById(activeChatId) : null;
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
  
  const otherUserInChat = activeChat && currentUser ? 
    activeChat.participants.find(p => p.userId !== currentUser.id) : null;
  
  const otherUserDetails = otherUserInChat ? (getUserById(otherUserInChat.userId) || UNKNOWN_USER_PLACEHOLDER) : null;
  const [profileToView, setProfileToView] = useState<User | typeof UNKNOWN_USER_PLACEHOLDER | null>(otherUserDetails);

  useEffect(() => {
    if (activeChatId) {
      setIsLoading(true);
      fetchMessages(activeChatId).finally(() => setIsLoading(false));
    }
  }, [activeChatId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  
  useEffect(() => { // Update profileToView if otherUserDetails changes (e.g. chat switch)
    setProfileToView(otherUserDetails);
  }, [otherUserDetails]);


  if (!activeChatId || !activeChat || !currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-secondary-100 dark:bg-secondary-900 text-secondary-500 dark:text-secondary-400 p-4 text-center">
        <ChatBubbleIcon className="w-24 h-24 opacity-50 mb-4" />
        <p className="text-xl">Select a chat to start messaging</p>
        <p className="text-sm">or start a new conversation from the list.</p>
      </div>
    );
  }
  
  const handleViewProfile = () => {
    if (otherUserDetails && 'id' in otherUserDetails) { // Check if it's a full User object
        setProfileToView(otherUserDetails);
        setIsViewProfileModalOpen(true);
    } else if (otherUserDetails === UNKNOWN_USER_PLACEHOLDER) {
        // Optionally show a simpler modal for unknown users or do nothing
        alert("Cannot view profile of an unknown or deleted user.");
    }
  };


  return (
    <div className="flex-1 flex flex-col bg-secondary-50 dark:bg-secondary-900 h-full">
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between bg-white dark:bg-secondary-800 shadow-sm">
        <div className="flex items-center min-w-0">
          <Avatar user={otherUserDetails || UNKNOWN_USER_PLACEHOLDER} size="md" />
          <div className="ml-3 min-w-0">
            <h3 className="font-semibold text-secondary-800 dark:text-secondary-100 truncate">{otherUserDetails?.name || otherUserDetails?.nickname || 'Chat'}</h3>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
              {otherUserDetails && 'status' in otherUserDetails && otherUserDetails.status === UserStatus.Online ? 'Online' : 
               (otherUserDetails && 'lastSeen' in otherUserDetails && otherUserDetails.lastSeen ? `Last seen ${formatTimestamp(otherUserDetails.lastSeen, 'relative')}` : 
               (otherUserDetails !== UNKNOWN_USER_PLACEHOLDER ? 'Offline' : 'Unknown Status'))}
            </p>
          </div>
        </div>
        {otherUserDetails && 'id' in otherUserDetails && <Button variant="ghost" onClick={handleViewProfile} leftIcon={<EyeIcon/>}>View Profile</Button>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
        {!isLoading && chatMessages.length === 0 && (
          <div className="text-center text-secondary-500 dark:text-secondary-400 py-10">
            No messages yet. Be the first to say hi! 👋
          </div>
        )}
        {!isLoading && chatMessages.map(msg => {
          const sender = getUserById(msg.senderId);
          return (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isSender={msg.senderId === currentUser.id}
              senderUser={sender || UNKNOWN_USER_PLACEHOLDER}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput chatId={activeChatId} />

      {profileToView && 'id' in profileToView && ( // Ensure profileToView is a full User, not placeholder
        <ProfilePage
            isOpen={isViewProfileModalOpen}
            onClose={() => setIsViewProfileModalOpen(false)}
            userId={profileToView.id}
            viewMode="view"
        />
      )}
    </div>
  );
};

const ContactsView: React.FC<{onContactSelect: (userId: string) => void;}> = ({onContactSelect}) => {
  const { users } = useUserManagement();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const displayUsers = users.filter(u => u.id !== currentUser?.id && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-secondary-200 dark:border-secondary-700 flex flex-col h-full bg-white dark:bg-secondary-800">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-100">Contacts</h2>
            <Input 
                type="search" 
                placeholder="Search contacts..." 
                aria-label="Search contacts"
                className="mt-2 w-full" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                wrapperClassName="mb-0"
            />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {displayUsers.length > 0 ? displayUsers.map(user => (
                <button key={user.id} onClick={() => onContactSelect(user.id)} className="w-full flex items-center p-3 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-150 rounded-lg text-left" aria-label={`Start chat with ${user.name}`}>
                    <Avatar user={user} size="md" />
                    <div className="ml-3 min-w-0">
                        <p className="font-semibold text-secondary-800 dark:text-secondary-100 truncate">{user.name}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">@{user.nickname}</p>
                    </div>
                </button>
            )) : <p className="p-4 text-center text-secondary-500 dark:text-secondary-400">No contacts found.</p>}
        </div>
    </div>
  );
};

const SearchView: React.FC = () => (
  <div className="w-full md:w-80 lg:w-96 border-r border-secondary-200 dark:border-secondary-700 flex flex-col h-full bg-white dark:bg-secondary-800 items-center justify-center p-4">
    <SearchIcon className="w-16 h-16 opacity-50 mb-4 text-secondary-400" />
    <p className="text-xl text-secondary-600 dark:text-secondary-300">Global Search</p>
    <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">Search for messages, users, or files (Not Implemented).</p>
  </div>
);

const ChatPage: React.FC<ChatPageProps> = ({ initialView = 'chats' }) => {
  const { logout, currentUser } = useAuth();
  const { createOrOpenChat, setActiveChatId, activeChatId } = useChat(); 
  const navigate = useNavigate();
  
  const [currentMainView, setCurrentMainView] = useState<'chats' | 'contacts' | 'search'>(initialView);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  useEffect(() => {
    setCurrentMainView(initialView);
    if (window.innerWidth < 768) { 
        setIsMobileListVisible(!(initialView === 'chats' && activeChatId));
    }
  }, [initialView, activeChatId]);

  const handleViewChange = (view: 'chats' | 'contacts' | 'search' | 'settings' | 'profile') => {
    if (view === 'settings') {
      navigate('/settings');
    } else if (view === 'profile') {
      setIsProfileModalOpen(true);
    } else {
      setCurrentMainView(view);
      if (view === 'chats') navigate('/');
      else if (view === 'contacts') navigate('/contacts');
      else if (view === 'search') navigate('/search');

      if (window.innerWidth < 768) {
          setIsMobileListVisible(true); 
      }
    }
  };

  const handleContactOrChatSelect = async (itemId: string, type: 'chat' | 'contact') => {
    if (type === 'contact') {
      if (!itemId) { 
          setCurrentMainView('contacts');
          navigate('/contacts');
          if (window.innerWidth < 768) setIsMobileListVisible(true);
          return;
      }
      const newChatId = await createOrOpenChat(itemId);
      if (newChatId) {
        setCurrentMainView('chats');
        navigate('/'); 
      }
    } else { 
      setActiveChatId(itemId);
    }
    if (window.innerWidth < 768) {
        setIsMobileListVisible(false); 
    }
  };
  
  useEffect(() => {
    const handlePopState = () => { 
        if (window.innerWidth < 768) {
            setIsMobileListVisible(true); 
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showMobileBackButton = window.innerWidth < 768 && !isMobileListVisible && activeChatId;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const renderLeftPanelContent = () => {
    switch (currentMainView) {
      case 'chats':
        return <ChatList onContactSelect={(userId) => handleContactOrChatSelect(userId, userId ? 'contact' : 'contact')} />;
      case 'contacts':
        return <ContactsView onContactSelect={(userId) => handleContactOrChatSelect(userId, 'contact')} />;
      case 'search':
        return <SearchView />; 
      default:
        return <ChatList onContactSelect={(userId) => handleContactOrChatSelect(userId, userId ? 'contact' : 'contact')} />;
    }
  };

  const showMessageAreaPanel = currentMainView === 'chats' && !!activeChatId;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeView={currentMainView} 
        onViewChange={handleViewChange} 
        onUserLogout={logout} // Changed prop name
        currentUser={currentUser}
      />
      
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        {isMobileListVisible ? (
          renderLeftPanelContent()
        ) : (
          showMessageAreaPanel ? <MessageArea /> : 
          <div className="flex-1 bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center p-4 text-center">
              <ChatBubbleIcon className="w-16 h-16 opacity-30 mb-2"/>
              <p>Select an option or chat to view messages.</p>
          </div>
        )}
        {showMobileBackButton && (
             <Button 
                variant="primary" 
                onClick={() => setIsMobileListVisible(true)}
                className="fixed top-4 left-20 z-20 !p-2 !rounded-full shadow-lg md:hidden"
                aria-label="Back to chat list"
            >
                <ArrowLeftIcon className="w-5 h-5"/>
            </Button>
        )}
      </div>

      <div className="hidden md:flex flex-1 overflow-hidden">
        {renderLeftPanelContent()}
        {showMessageAreaPanel ? <MessageArea /> : (
            <div className="flex-1 bg-secondary-100 dark:bg-secondary-900 flex flex-col items-center justify-center p-4 text-center">
                 <ChatBubbleIcon className="w-24 h-24 opacity-30 mb-4"/>
                <p className="text-xl text-secondary-600 dark:text-secondary-400">Welcome to {APP_NAME}!</p>
                <p className="text-secondary-500 dark:text-secondary-500">Select a chat to view messages or start a new one.</p>
            </div>
        )}
      </div>

      {isProfileModalOpen && currentUser && (
        <ProfilePage 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)}
            userId={currentUser.id}
            viewMode="edit"
        />
      )}
    </div>
  );
};

export default ChatPage;
