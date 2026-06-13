import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { generateAvatarId, generateMask, MOCK_NOTIFICATIONS, MOCK_POSTS, Post, Notification } from "@/data/mockData";

interface UserIdentity {
  mask: string;
  avatarId: number;
  bio: string;
  karma: number;
  isPremium: boolean;
  joinDate: number;
  soulScore: number;
}

interface AppContextType {
  identity: UserIdentity | null;
  hasOnboarded: boolean;
  posts: Post[];
  notifications: Notification[];
  unreadCount: number;
  likedPosts: Set<string>;
  repostedPosts: Set<string>;
  setHasOnboarded: (val: boolean) => void;
  completeOnboarding: (mask: string, avatarId: number) => Promise<void>;
  toggleLike: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  addPost: (post: Post) => void;
  markAllRead: () => void;
  updateBio: (bio: string) => void;
  upgradePremium: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedIdentity = await AsyncStorage.getItem("maskverse_identity");
      const storedOnboarded = await AsyncStorage.getItem("maskverse_onboarded");
      const storedLikes = await AsyncStorage.getItem("maskverse_likes");
      const storedReposts = await AsyncStorage.getItem("maskverse_reposts");

      if (storedIdentity) setIdentity(JSON.parse(storedIdentity));
      if (storedOnboarded === "true") setHasOnboarded(true);
      if (storedLikes) setLikedPosts(new Set(JSON.parse(storedLikes)));
      if (storedReposts) setRepostedPosts(new Set(JSON.parse(storedReposts)));
    } catch {}
  }

  async function completeOnboarding(mask: string, avatarId: number) {
    const newIdentity: UserIdentity = {
      mask,
      avatarId,
      bio: "",
      karma: 0,
      isPremium: false,
      joinDate: Date.now(),
      soulScore: Math.floor(Math.random() * 30) + 70,
    };
    setIdentity(newIdentity);
    setHasOnboarded(true);
    await AsyncStorage.setItem("maskverse_identity", JSON.stringify(newIdentity));
    await AsyncStorage.setItem("maskverse_onboarded", "true");
  }

  function toggleLike(postId: string) {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      AsyncStorage.setItem("maskverse_likes", JSON.stringify([...next]));
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reactions: { ...p.reactions, heart: likedPosts.has(postId) ? p.reactions.heart - 1 : p.reactions.heart + 1 } }
          : p
      )
    );
  }

  function toggleRepost(postId: string) {
    setRepostedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      AsyncStorage.setItem("maskverse_reposts", JSON.stringify([...next]));
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reposts: repostedPosts.has(postId) ? p.reposts - 1 : p.reposts + 1 }
          : p
      )
    );
  }

  function addPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function updateBio(bio: string) {
    if (!identity) return;
    const updated = { ...identity, bio };
    setIdentity(updated);
    AsyncStorage.setItem("maskverse_identity", JSON.stringify(updated));
  }

  function upgradePremium() {
    if (!identity) return;
    const updated = { ...identity, isPremium: true };
    setIdentity(updated);
    AsyncStorage.setItem("maskverse_identity", JSON.stringify(updated));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        identity,
        hasOnboarded,
        posts,
        notifications,
        unreadCount,
        likedPosts,
        repostedPosts,
        setHasOnboarded,
        completeOnboarding,
        toggleLike,
        toggleRepost,
        addPost,
        markAllRead,
        updateBio,
        upgradePremium,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
