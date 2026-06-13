export type MoodTag = "fire" | "chill" | "rant" | "confession" | "advice" | "dark" | "love" | "chaos";

export interface Post {
  id: string;
  authorMask: string;
  authorAvatar: number;
  content: string;
  mood: MoodTag;
  reactions: { fire: number; heart: number; ghost: number; mind: number };
  comments: number;
  reposts: number;
  timestamp: number;
  expiresIn?: number;
  isDisappearing?: boolean;
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorMask: string;
  authorAvatar: number;
  content: string;
  timestamp: number;
  likes: number;
}

export interface ChatThread {
  id: string;
  peerMask: string;
  peerAvatar: number;
  lastMessage: string;
  lastTime: number;
  unread: number;
  isWhisper: boolean;
  isSoulMatch: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: "me" | "them";
  content: string;
  timestamp: number;
  isWhisper: boolean;
  burned: boolean;
}

export interface DeepTalkRoom {
  id: string;
  title: string;
  hostMask: string;
  hostAvatar: number;
  listeners: number;
  speakers: number;
  tags: string[];
  isLive: boolean;
}

export interface TrendingTopic {
  id: string;
  tag: string;
  posts: number;
  rising: boolean;
}

export interface Notification {
  id: string;
  type: "reaction" | "comment" | "repost" | "soul_match" | "whisper" | "system";
  actorMask: string;
  actorAvatar: number;
  content: string;
  timestamp: number;
  read: boolean;
}

const MASKS = [
  "ShadowFox", "NeonWolf", "VoidSerpent", "CryptoGhost", "NullPhantom",
  "GlitchRaven", "DarkOracle", "CipherMoth", "QuantumVeil", "StealthPulse",
  "NightCode", "HexWraith", "SilentByte", "MirrorDemon", "LostSignal",
  "EchoMask", "DataSpectre", "VoidWalker", "NeonReaper", "GhostNode",
  "ShadowPulse", "CryptoPhoenix", "BinaryGhost", "SilentStorm", "DarkMatter",
];

const SUFFIXES = ["42", "7", "19", "88", "0x", "13", "404", "999", "π", "∞"];

export function generateMask(): string {
  const base = MASKS[Math.floor(Math.random() * MASKS.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  return `${base}${suffix}`;
}

export function generateAvatarId(): number {
  return Math.floor(Math.random() * 20);
}

export const AVATAR_COLORS = [
  "#00e5ff", "#b400ff", "#ff0062", "#00ff99", "#ffaa00",
  "#ff6600", "#0088ff", "#ff00aa", "#44ff00", "#ff4444",
  "#00aaff", "#ff0088", "#88ff00", "#aa00ff", "#ff8800",
  "#00ffaa", "#ff0044", "#4400ff", "#ffff00", "#00ffff",
];

export const AVATAR_SYMBOLS = [
  "👁", "🦊", "🐺", "🐍", "👻", "🦅", "🦉", "🦋", "🔮", "⚡",
  "🌙", "💀", "🎭", "🌊", "🔥", "🌀", "⭐", "🌑", "🕷", "🦇",
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    authorMask: "ShadowFox42",
    authorAvatar: 0,
    content: "Told my best friend something I never told anyone else tonight. The anonymity here is the only reason I could say it. She doesn't know it was me.",
    mood: "confession",
    reactions: { fire: 234, heart: 891, ghost: 45, mind: 167 },
    comments: 89,
    reposts: 34,
    timestamp: Date.now() - 1000 * 60 * 12,
    isDisappearing: true,
    expiresIn: 3600,
  },
  {
    id: "p2",
    authorMask: "NeonWolf7",
    authorAvatar: 1,
    content: "3am thoughts: What if the people you miss the most are the ones who never knew you existed?",
    mood: "dark",
    reactions: { fire: 567, heart: 1204, ghost: 88, mind: 445 },
    comments: 213,
    reposts: 156,
    timestamp: Date.now() - 1000 * 60 * 28,
  },
  {
    id: "p3",
    authorMask: "VoidSerpent19",
    authorAvatar: 2,
    content: "Hot take: social media made loneliness worse while selling you the cure. This app is the first thing that felt real in years.",
    mood: "rant",
    reactions: { fire: 1834, heart: 445, ghost: 23, mind: 788 },
    comments: 445,
    reposts: 289,
    timestamp: Date.now() - 1000 * 60 * 45,
    isPinned: false,
  },
  {
    id: "p4",
    authorMask: "CryptoGhost88",
    authorAvatar: 3,
    content: "Playing lo-fi at 2am pretending my life is a movie. The director would be very disappointed.",
    mood: "chill",
    reactions: { fire: 445, heart: 2341, ghost: 156, mind: 234 },
    comments: 78,
    reposts: 67,
    timestamp: Date.now() - 1000 * 60 * 67,
  },
  {
    id: "p5",
    authorMask: "GlitchRaven13",
    authorAvatar: 4,
    content: "Need real advice: Do I tell my crush I like them anonymously here or just suffer in silence for the next 3 years?",
    mood: "advice",
    reactions: { fire: 123, heart: 567, ghost: 89, mind: 334 },
    comments: 312,
    reposts: 45,
    timestamp: Date.now() - 1000 * 60 * 92,
    isDisappearing: true,
    expiresIn: 7200,
  },
  {
    id: "p6",
    authorMask: "DarkOracle∞",
    authorAvatar: 5,
    content: "Nobody knows my name here but somehow this is the realest version of me that's ever existed online.",
    mood: "fire",
    reactions: { fire: 2891, heart: 1234, ghost: 267, mind: 891 },
    comments: 156,
    reposts: 445,
    timestamp: Date.now() - 1000 * 60 * 110,
  },
  {
    id: "p7",
    authorMask: "CipherMoth404",
    authorAvatar: 6,
    content: "I whispered to a stranger on here at 4am. They whispered back. We talked until sunrise. Neither of us knows who the other is. I think about it every day.",
    mood: "love",
    reactions: { fire: 3445, heart: 7823, ghost: 345, mind: 1234 },
    comments: 678,
    reposts: 892,
    timestamp: Date.now() - 1000 * 60 * 180,
  },
  {
    id: "p8",
    authorMask: "QuantumVeil0x",
    authorAvatar: 7,
    content: "CHAOS THEORY: A butterfly flaps its wings in Tokyo and I still reply to texts 3 days late.",
    mood: "chaos",
    reactions: { fire: 567, heart: 234, ghost: 445, mind: 156 },
    comments: 45,
    reposts: 234,
    timestamp: Date.now() - 1000 * 60 * 240,
  },
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  p1: [
    { id: "c1", postId: "p1", authorMask: "MirrorDemon13", authorAvatar: 8, content: "This made me tear up. You're braver than you know.", timestamp: Date.now() - 1000 * 60 * 8, likes: 45 },
    { id: "c2", postId: "p1", authorMask: "LostSignal999", authorAvatar: 9, content: "I did the same thing six months ago. Still the best decision I ever made.", timestamp: Date.now() - 1000 * 60 * 5, likes: 89 },
    { id: "c3", postId: "p1", authorMask: "EchoMask7", authorAvatar: 10, content: "Anonymity is the truest form of honesty.", timestamp: Date.now() - 1000 * 60 * 3, likes: 234 },
  ],
  p2: [
    { id: "c4", postId: "p2", authorMask: "DataSpectre42", authorAvatar: 11, content: "Hit different at 3am reading this.", timestamp: Date.now() - 1000 * 60 * 20, likes: 167 },
    { id: "c5", postId: "p2", authorMask: "VoidWalker0x", authorAvatar: 12, content: "Philosophy dropped harder than any textbook.", timestamp: Date.now() - 1000 * 60 * 15, likes: 312 },
  ],
};

export const MOCK_CHATS: ChatThread[] = [
  { id: "ch1", peerMask: "CipherMoth404", peerAvatar: 6, lastMessage: "Do you ever feel like you're living two separate lives?", lastTime: Date.now() - 1000 * 60 * 5, unread: 2, isWhisper: false, isSoulMatch: true },
  { id: "ch2", peerMask: "NeonReaper88", peerAvatar: 13, lastMessage: "whisper: meet me at the void space tonight", lastTime: Date.now() - 1000 * 60 * 34, unread: 0, isWhisper: true, isSoulMatch: false },
  { id: "ch3", peerMask: "GhostNode∞", peerAvatar: 14, lastMessage: "Your post about the stars really got to me", lastTime: Date.now() - 1000 * 60 * 67, unread: 1, isWhisper: false, isSoulMatch: false },
  { id: "ch4", peerMask: "SilentStorm19", peerAvatar: 15, lastMessage: "Same. I thought I was the only one.", lastTime: Date.now() - 1000 * 60 * 120, unread: 0, isWhisper: false, isSoulMatch: false },
  { id: "ch5", peerMask: "DarkMatter404", peerAvatar: 16, lastMessage: "We matched 94% on soul compatibility", lastTime: Date.now() - 1000 * 60 * 240, unread: 3, isWhisper: false, isSoulMatch: true },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  ch1: [
    { id: "m1", threadId: "ch1", sender: "them", content: "Hey, I saw your confession post. Are you okay?", timestamp: Date.now() - 1000 * 60 * 30, isWhisper: false, burned: false },
    { id: "m2", threadId: "ch1", sender: "me", content: "Honestly? Better than I've been in a while, weirdly.", timestamp: Date.now() - 1000 * 60 * 25, isWhisper: false, burned: false },
    { id: "m3", threadId: "ch1", sender: "them", content: "Anonymity does that. You can be real without the weight.", timestamp: Date.now() - 1000 * 60 * 20, isWhisper: false, burned: false },
    { id: "m4", threadId: "ch1", sender: "me", content: "Exactly. I've never talked to anyone like this before.", timestamp: Date.now() - 1000 * 60 * 15, isWhisper: false, burned: false },
    { id: "m5", threadId: "ch1", sender: "them", content: "Do you ever feel like you're living two separate lives?", timestamp: Date.now() - 1000 * 60 * 5, isWhisper: false, burned: false },
  ],
  ch2: [
    { id: "m6", threadId: "ch2", sender: "them", content: "whisper: meet me at the void space tonight", timestamp: Date.now() - 1000 * 60 * 34, isWhisper: true, burned: false },
  ],
};

export const DEEPTALK_ROOMS: DeepTalkRoom[] = [
  { id: "dt1", title: "3AM Confessions Lounge", hostMask: "VoidSerpent19", hostAvatar: 2, listeners: 1834, speakers: 4, tags: ["confession", "dark", "open"], isLive: true },
  { id: "dt2", title: "Existential Crisis Hour", hostMask: "DarkOracle∞", hostAvatar: 5, listeners: 445, speakers: 6, tags: ["philosophy", "deep", "anonymous"], isLive: true },
  { id: "dt3", title: "Chill Frequency — No Faces", hostMask: "CipherMoth404", hostAvatar: 6, listeners: 2341, speakers: 2, tags: ["music", "chill", "lofi"], isLive: true },
  { id: "dt4", title: "Anonymous Rant Space", hostMask: "GlitchRaven13", hostAvatar: 4, listeners: 678, speakers: 8, tags: ["rant", "fire", "real"], isLive: true },
  { id: "dt5", title: "Soul Match Frequency", hostMask: "NeonWolf7", hostAvatar: 1, listeners: 234, speakers: 3, tags: ["love", "connection", "match"], isLive: false },
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: "t1", tag: "#VoidHours", posts: 45678, rising: true },
  { id: "t2", tag: "#AnonymousLove", posts: 23456, rising: true },
  { id: "t3", tag: "#3AMThoughts", posts: 89234, rising: false },
  { id: "t4", tag: "#MaskVerse", posts: 156789, rising: true },
  { id: "t5", tag: "#TrueConfessions", posts: 34567, rising: true },
  { id: "t6", tag: "#GhostMode", posts: 12345, rising: false },
  { id: "t7", tag: "#SoulMatch", posts: 67890, rising: true },
  { id: "t8", tag: "#DeepTalk", posts: 29340, rising: false },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "soul_match", actorMask: "CipherMoth404", actorAvatar: 6, content: "You matched 96% soul compatibility", timestamp: Date.now() - 1000 * 60 * 5, read: false },
  { id: "n2", type: "reaction", actorMask: "DarkOracle∞", actorAvatar: 5, content: "reacted 🔥 to your confession", timestamp: Date.now() - 1000 * 60 * 12, read: false },
  { id: "n3", type: "comment", actorMask: "GlitchRaven13", actorAvatar: 4, content: "commented on your post", timestamp: Date.now() - 1000 * 60 * 28, read: false },
  { id: "n4", type: "whisper", actorMask: "NeonReaper88", actorAvatar: 13, content: "sent you a whisper", timestamp: Date.now() - 1000 * 60 * 45, read: true },
  { id: "n5", type: "repost", actorMask: "VoidWalker0x", actorAvatar: 12, content: "reposted your 3AM thought", timestamp: Date.now() - 1000 * 60 * 67, read: true },
  { id: "n6", type: "system", actorMask: "MaskVerse", actorAvatar: -1, content: "Your post reached 1,000 reactions", timestamp: Date.now() - 1000 * 60 * 90, read: true },
  { id: "n7", type: "soul_match", actorMask: "StealthPulse7", actorAvatar: 17, content: "You matched 88% soul compatibility", timestamp: Date.now() - 1000 * 60 * 180, read: true },
];

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export const MOOD_CONFIG: Record<MoodTag, { label: string; color: string; icon: string }> = {
  fire:       { label: "Fire",       color: "#ff4400", icon: "zap" },
  chill:      { label: "Chill",      color: "#00aaff", icon: "droplet" },
  rant:       { label: "Rant",       color: "#ff0062", icon: "alert-circle" },
  confession: { label: "Confession", color: "#b400ff", icon: "eye-off" },
  advice:     { label: "Advice",     color: "#00ff99", icon: "help-circle" },
  dark:       { label: "Dark",       color: "#8844ff", icon: "moon" },
  love:       { label: "Love",       color: "#ff4488", icon: "heart" },
  chaos:      { label: "Chaos",      color: "#ffaa00", icon: "activity" },
};
