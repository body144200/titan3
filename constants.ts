
import { User, Chat, Message, UserStatus, MessageType, AppSettings, Theme } from './types';
import { getInitials, getRandomColor } from './utils'; 

export const APP_NAME = "TitanChat";

export const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const USER_ID_1 = "user1_alice";
const USER_ID_2 = "user2_bob";
const USER_ID_3 = "user3_charlie_admin";
const USER_ID_4 = "user4_david";

export const INITIAL_MOCK_USERS: User[] = [
  {
    id: USER_ID_1,
    name: "Alice Wonderland",
    nickname: "AliceW",
    email: "alice@example.com",
    passwordHash: "password123", 
    avatarBgColor: getRandomColor(AVATAR_COLORS, "Alice Wonderland"),
    isAdmin: false,
    status: UserStatus.Online,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), 
    lastSeen: new Date().toISOString(),
  },
  {
    id: USER_ID_2,
    name: "Bob The Builder",
    nickname: "BobB",
    email: "bob@example.com",
    passwordHash: "password123",
    avatarUrl: "https://picsum.photos/seed/bob/200/200",
    avatarBgColor: getRandomColor(AVATAR_COLORS, "Bob The Builder"),
    isAdmin: false,
    status: UserStatus.Offline,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), 
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), 
  },
  {
    id: USER_ID_3,
    name: "Charlie Admin",
    nickname: "CharlieA",
    email: "admin@example.com",
    passwordHash: "adminpass",
    avatarBgColor: getRandomColor(AVATAR_COLORS, "Charlie Admin"),
    isAdmin: true,
    status: UserStatus.Online,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), 
    lastSeen: new Date().toISOString(),
  },
  {
    id: USER_ID_4,
    name: "David Copperfield",
    nickname: "DavidC",
    email: "david@example.com",
    passwordHash: "password123",
    avatarUrl: "https://picsum.photos/seed/david/200/200",
    avatarBgColor: getRandomColor(AVATAR_COLORS, "David Copperfield"),
    isAdmin: false,
    status: UserStatus.Online,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), 
    lastSeen: new Date().toISOString(),
  }
];

export const UNKNOWN_USER_PLACEHOLDER: Pick<User, 'name' | 'nickname' | 'avatarBgColor'> = {
  name: "Unknown User",
  nickname: "unknown",
  avatarBgColor: "bg-gray-400",
};


const CHAT_ID_1 = "chat1_alice_bob";
const CHAT_ID_2 = "chat2_alice_charlie";

const alice = INITIAL_MOCK_USERS.find(u => u.id === USER_ID_1)!;
const bob = INITIAL_MOCK_USERS.find(u => u.id === USER_ID_2)!;
const charlie = INITIAL_MOCK_USERS.find(u => u.id === USER_ID_3)!;

export const MOCK_MESSAGES_CHAT1: Message[] = [
  { id: "msg1", chatId: CHAT_ID_1, senderId: USER_ID_1, text: "Hey Bob, how are you?", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: "msg2", chatId: CHAT_ID_1, senderId: USER_ID_2, text: "Hi Alice! Doing great, thanks for asking. How about you?", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: "msg3", chatId: CHAT_ID_1, senderId: USER_ID_1, text: "I'm good too! Working on a new project.", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: "msg4", chatId: CHAT_ID_1, senderId: USER_ID_2, text: "Sounds exciting! Tell me more.", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: "msg5", chatId: CHAT_ID_1, senderId: USER_ID_1, text: "https://picsum.photos/seed/project/400/300", type: MessageType.Image, timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
];

export const MOCK_MESSAGES_CHAT2: Message[] = [
  { id: "msg6", chatId: CHAT_ID_2, senderId: USER_ID_3, text: "Alice, can you check the latest deployment?", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: "msg7", chatId: CHAT_ID_2, senderId: USER_ID_1, text: "Sure Charlie, on it!", type: MessageType.Text, timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
];


export const MOCK_CHATS: Chat[] = [ 
  {
    id: CHAT_ID_1,
    participants: [
      { userId: USER_ID_1, nickname: alice.nickname, avatarUrl: alice.avatarUrl, avatarBgColor: alice.avatarBgColor },
      { userId: USER_ID_2, nickname: bob.nickname, avatarUrl: bob.avatarUrl, avatarBgColor: bob.avatarBgColor }
    ],
    isGroup: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
    lastMessage: MOCK_MESSAGES_CHAT1[MOCK_MESSAGES_CHAT1.length - 1],
    unreadCount: 1,
  },
  {
    id: CHAT_ID_2,
    participants: [
      { userId: USER_ID_1, nickname: alice.nickname, avatarUrl: alice.avatarUrl, avatarBgColor: alice.avatarBgColor },
      { userId: USER_ID_3, nickname: charlie.nickname, avatarUrl: charlie.avatarUrl, avatarBgColor: charlie.avatarBgColor }
    ],
    isGroup: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), 
    lastMessage: MOCK_MESSAGES_CHAT2[MOCK_MESSAGES_CHAT2.length - 1],
  }
];

export const MOCK_ALL_MESSAGES: { [chatId: string]: Message[] } = { 
  [CHAT_ID_1]: MOCK_MESSAGES_CHAT1,
  [CHAT_ID_2]: MOCK_MESSAGES_CHAT2,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: Theme.Light, // Default to light, will be overridden by OS preference if no setting saved
  language: 'en',
  notificationsEnabled: true,
};
