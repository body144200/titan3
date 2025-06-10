
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Chat, Message, AuthContextType, ChatContextType, UserManagementContextType, SettingsContextType, Theme, UserStatus, MessageType, AppSettings, Language } from './types';
import { INITIAL_MOCK_USERS, MOCK_CHATS, MOCK_ALL_MESSAGES, AVATAR_COLORS, DEFAULT_APP_SETTINGS } from './constants';
import { generateToken, decodeToken, generateId, getRandomColor } from './utils';

const ALL_USERS_STORAGE_KEY = 'titanChatAllUsers';
const APP_SETTINGS_STORAGE_KEY_PREFIX = 'titanChatAppSettings_';

// --- User Management Context ---
const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage:", error);
    }
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
    return INITIAL_MOCK_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage:", error);
    }
  }, [users]);

  const getUserById = useCallback((userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  }, [users]);

  const updateUser = useCallback(async (userId: string, updatedData: Partial<User>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    return true;
  }, []);

  const deleteUserByAdmin = useCallback(async (userId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    return true;
  }, []);

  return (
    <UserManagementContext.Provider value={{ users, setUsers, getUserById, updateUser, deleteUserByAdmin }}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = (): UserManagementContextType => {
  const context = useContext(UserManagementContext);
  if (!context) throw new Error('useUserManagement must be used within a UserProvider');
  return context;
};

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('titanChatToken'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userContext = useContext(UserManagementContext);

  useEffect(() => {
    if (token && userContext?.users && userContext.users.length > 0) {
      const decodedUser = decodeToken(token, userContext.users);
      setCurrentUser(decodedUser);
      if (decodedUser && userContext.setUsers && decodedUser.status !== UserStatus.Online) {
         userContext.setUsers(prevUsers =>
            prevUsers.map(u =>
                u.id === decodedUser.id ? { ...u, status: UserStatus.Online, lastSeen: new Date().toISOString() } : u
            )
        );
      }
    } else if (!token) {
        setCurrentUser(null);
    }
  }, [token, userContext?.users, userContext?.setUsers]);


  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    if (!userContext?.users) return false;
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const user = userContext.users.find(u => u.email === email && u.passwordHash === pass);
    if (user) {
      const userToken = generateToken(user);
      setCurrentUser(user);
      setToken(userToken);
      localStorage.setItem('titanChatToken', userToken);
      if (userContext.setUsers) {
        userContext.setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, status: UserStatus.Online, lastSeen: new Date().toISOString() } : u));
      }
      return true;
    }
    return false;
  }, [userContext, setToken, setCurrentUser]);

  const signup = useCallback(async (userData: Omit<User, 'id' | 'isAdmin' | 'status' | 'joinedAt' | 'avatarBgColor'> & { avatarInitialColorSeed?: string }): Promise<boolean> => {
    if (!userContext || !userContext.users || !userContext.setUsers) return false;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (userContext.users.some(u => u.email === userData.email || u.nickname === userData.nickname)) {
      console.error("User already exists");
      return false;
    }
    const newUser: User = {
      id: generateId(),
      ...userData,
      avatarBgColor: getRandomColor(AVATAR_COLORS, userData.avatarInitialColorSeed || userData.name),
      isAdmin: false,
      status: UserStatus.Online,
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
    
    userContext.setUsers(prev => [...prev, newUser]);
    
    const userToken = generateToken(newUser);
    setCurrentUser(newUser);
    setToken(userToken);
    localStorage.setItem('titanChatToken', userToken);
    return true;
  }, [userContext, setToken, setCurrentUser]);

  const logout = useCallback(() => {
    if (currentUser && userContext?.setUsers) {
        userContext.setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, status: UserStatus.Offline, lastSeen: new Date().toISOString() } : u));
    }
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('titanChatToken');
  }, [currentUser, userContext, setCurrentUser, setToken]);

  const updateCurrentUser = useCallback((updatedData: Partial<Pick<User, 'name' | 'nickname' | 'avatarUrl' | 'avatarBgColor'>>) => {
    setCurrentUser(prevLocalCurrentUser => {
      if (!prevLocalCurrentUser) return null;
      const updatedLocalCurrentUser = { ...prevLocalCurrentUser, ...updatedData };
      
      if (userContext?.setUsers) {
        userContext.setUsers(allUsers => 
          allUsers.map(u => u.id === updatedLocalCurrentUser.id ? { ...u, ...updatedData} : u)
        );
      }
      return updatedLocalCurrentUser;
    });
  }, [userContext?.setUsers, setCurrentUser]);
  
  const deleteAccount = useCallback(async (): Promise<boolean> => {
    if (!currentUser || !userContext || !userContext.setUsers) return false;
    await new Promise(resolve => setTimeout(resolve, 500));
    userContext.setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    logout();
    return true;
  }, [currentUser, userContext, logout]);

  return (
    <AuthContext.Provider value={{ currentUser, token, login, signup, logout, updateCurrentUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- Settings Context ---
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const { currentUser } = useAuth();
    const [settings, setSettingsState] = useState<AppSettings>(() => {
        let savedSettingsJson: string | null = null;
        if (currentUser?.id) {
            savedSettingsJson = localStorage.getItem(`${APP_SETTINGS_STORAGE_KEY_PREFIX}${currentUser.id}`);
        }
        if (savedSettingsJson) {
            try {
                return JSON.parse(savedSettingsJson);
            } catch (e) { console.error("Failed to parse user settings", e); }
        }
        // Fallback to OS preference for theme if no user or no saved settings
        const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return { ...DEFAULT_APP_SETTINGS, theme: osPrefersDark ? Theme.Dark : Theme.Light };
    });

    useEffect(() => {
        // Load user-specific settings when currentUser changes
        let userSettings = DEFAULT_APP_SETTINGS;
        const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        userSettings = {...userSettings, theme: osPrefersDark ? Theme.Dark : Theme.Light }

        if (currentUser?.id) {
            const savedSettingsJson = localStorage.getItem(`${APP_SETTINGS_STORAGE_KEY_PREFIX}${currentUser.id}`);
            if (savedSettingsJson) {
                try {
                    userSettings = JSON.parse(savedSettingsJson);
                } catch (e) { console.error("Failed to parse user settings on user change", e); }
            }
        }
        setSettingsState(userSettings);
    }, [currentUser?.id]);


    useEffect(() => {
        // Apply theme and language to document
        const root = window.document.documentElement;
        if (settings.theme === Theme.Dark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        root.lang = settings.language;
        root.dir = settings.language === 'ar' ? 'rtl' : 'ltr';

        // Save settings if a user is logged in
        if (currentUser?.id) {
            localStorage.setItem(`${APP_SETTINGS_STORAGE_KEY_PREFIX}${currentUser.id}`, JSON.stringify(settings));
        }
    }, [settings, currentUser?.id]);
    
    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettingsState(s => ({ ...s, [key]: value }));
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, theme: settings.theme, language: settings.language }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

// --- Chat Context ---
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { getUserById, users } = useUserManagement(); // users dependency for re-filtering

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(MOCK_ALL_MESSAGES);

  useEffect(() => {
    if (currentUser && getUserById) {
      const userChats = MOCK_CHATS
        .filter(chat => {
          const isCurrentUserParticipant = chat.participants.some(p => p.userId === currentUser.id);
          if (!isCurrentUserParticipant) return false;
          
          // For 1-on-1 chats, ensure the other participant exists
          if (!chat.isGroup && chat.participants.length === 2) {
            const otherParticipantEntry = chat.participants.find(p => p.userId !== currentUser.id);
            return otherParticipantEntry ? !!getUserById(otherParticipantEntry.userId) : false;
          }
          // For group chats: (future) check if min active participants exist
          return true; 
        })
        .map(chat => ({
          ...chat,
          lastMessage: chat.lastMessage || (MOCK_ALL_MESSAGES[chat.id]?.[MOCK_ALL_MESSAGES[chat.id].length - 1])
        }))
        .sort((a, b) => new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime());
      setChats(userChats);
      setMessages(MOCK_ALL_MESSAGES); 
    } else {
      setChats([]);
      setMessages({});
      setActiveChatId(null);
    }
  }, [currentUser, getUserById, users]); // users ensures re-filter if users are deleted/added


  const fetchMessages = useCallback(async (chatId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setMessages(prev => ({ ...prev, [chatId]: MOCK_ALL_MESSAGES[chatId] || [] }));
  }, []);

  const sendMessage = useCallback(async (chatId: string, textContent: string, type: MessageType = MessageType.Text, replyTo?: string): Promise<void> => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: generateId(),
      chatId,
      senderId: currentUser.id,
      text: textContent,
      type,
      replyTo,
      timestamp: new Date().toISOString(),
    };

    await new Promise(resolve => setTimeout(resolve, 100));
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));
    
    MOCK_ALL_MESSAGES[chatId] = [...(MOCK_ALL_MESSAGES[chatId] || []), newMessage];

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat
      ).sort((a,b) => new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime())
    );
  }, [currentUser]);

  const getChatById = useCallback((chatId: string): Chat | undefined => {
    return chats.find(c => c.id === chatId);
  }, [chats]);

  const createOrOpenChat = useCallback(async (otherUserId: string): Promise<string | null> => {
    if (!currentUser || !getUserById) return null;

    const existingChat = chats.find(chat => 
      chat.participants.some(p => p.userId === otherUserId) && 
      chat.participants.some(p => p.userId === currentUser.id) &&
      !chat.isGroup
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
      return existingChat.id;
    }

    const otherUser = getUserById(otherUserId);
    if (!otherUser) {
        console.error("Cannot create chat: Other user not found.");
        return null;
    }

    const newChatId = generateId();
    const newChat: Chat = {
      id: newChatId,
      participants: [
        { userId: currentUser.id, nickname: currentUser.nickname, avatarUrl: currentUser.avatarUrl, avatarBgColor: currentUser.avatarBgColor },
        { userId: otherUser.id, nickname: otherUser.nickname, avatarUrl: otherUser.avatarUrl, avatarBgColor: otherUser.avatarBgColor }
      ],
      isGroup: false,
      createdAt: new Date().toISOString(),
    };
    
    MOCK_CHATS.push(newChat); 
    setChats(prev => [newChat, ...prev].sort((a,b) => new Date(b.lastMessage?.timestamp || b.createdAt).getTime() - new Date(a.lastMessage?.timestamp || a.createdAt).getTime()));
    setActiveChatId(newChat.id);
    return newChat.id;

  }, [currentUser, chats, getUserById, setActiveChatId, setChats]);

  const updateMessageInChat = useCallback((chatId: string, messageId: string, updatedMessagePartial: Partial<Message>) => {
    setMessages(prevMessages => {
        const chatMessages = prevMessages[chatId] || [];
        const updatedChatMessages = chatMessages.map(msg => 
            msg.id === messageId ? { ...msg, ...updatedMessagePartial } : msg
        );
        return { ...prevMessages, [chatId]: updatedChatMessages };
    });
    if (MOCK_ALL_MESSAGES[chatId]) {
        const msgIndex = MOCK_ALL_MESSAGES[chatId].findIndex(m => m.id === messageId);
        if (msgIndex !== -1) {
            MOCK_ALL_MESSAGES[chatId][msgIndex] = { ...MOCK_ALL_MESSAGES[chatId][msgIndex], ...updatedMessagePartial };
        }
    }
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats, activeChatId, setActiveChatId, messages, setMessages, sendMessage, fetchMessages, getChatById, createOrOpenChat, updateMessageInChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

// --- Combined Provider ---
export const AppProviders: React.FC<{children: ReactNode}> = ({ children }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <SettingsProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </SettingsProvider>
      </AuthProvider>
    </UserProvider>
  );
};
