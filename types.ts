
export enum UserStatus {
  Online = "Online",
  Offline = "Offline",
}

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hash
  avatarUrl?: string;
  avatarBgColor: string;
  isAdmin: boolean;
  status: UserStatus;
  joinedAt: string; // ISO date string
  lastSeen?: string; // ISO date string
}

export interface ChatParticipant {
  userId: string;
  nickname: string;
  avatarUrl?: string;
  avatarBgColor: string;
}

export interface Chat {
  id: string;
  participants: ChatParticipant[];
  isGroup: boolean;
  createdAt: string; // ISO date string
  lastMessage?: Message;
  unreadCount?: number;
  name?: string; // For group chats primarily
}

export enum MessageType {
  Text = "text",
  Image = "image",
  File = "file",
  Like = "like", // For the quick 👍
}

export interface Message {
  id:string;
  chatId: string;
  senderId: string;
  text?: string; // content for text, filename for file, image url for image
  type: MessageType;
  replyTo?: string; // messageId of the original message
  timestamp: string; // ISO date string
  reactions?: { [emoji: string]: string[] }; // emoji: [userIds]
}

export interface DecodedJWT {
  userId: string;
  email: string;
  nickname: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export type Language = 'en' | 'ar';

export interface AppSettings {
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
}

// Context Types
export interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'isAdmin' | 'status' | 'joinedAt' | 'avatarBgColor'> & { avatarInitialColorSeed?: string }) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<Pick<User, 'name' | 'nickname' | 'avatarUrl' | 'avatarBgColor'>>) => void; // More specific
  deleteAccount: () => Promise<boolean>;
}

export interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  messages: { [chatId: string]: Message[] };
  setMessages: React.Dispatch<React.SetStateAction<{ [chatId: string]: Message[] }>>;
  sendMessage: (chatId: string, content: string, type?: MessageType, replyTo?: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  getChatById: (chatId: string) => Chat | undefined;
  createOrOpenChat: (otherUserId: string) => Promise<string | null>;
  updateMessageInChat: (chatId: string, messageId: string, updatedMessage: Partial<Message>) => void;
}

export interface UserManagementContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  getUserById: (userId: string) => User | undefined;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<boolean>;
  deleteUserByAdmin: (userId: string) => Promise<boolean>;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  // Expose theme and language directly for convenience if needed, though settings object is primary
  theme: Theme;
  language: Language;
}
