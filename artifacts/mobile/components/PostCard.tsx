import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { formatCount, MOOD_CONFIG, Post, timeAgo } from "@/data/mockData";
import { AvatarMask } from "./AvatarMask";
import { useApp } from "@/context/AppContext";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { likedPosts, repostedPosts, toggleLike, toggleRepost } = useApp();
  const mood = MOOD_CONFIG[post.mood];
  const isLiked = likedPosts.has(post.id);
  const isReposted = repostedPosts.has(post.id);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const [countdown, setCountdown] = useState<number | null>(
    post.isDisappearing && post.expiresIn ? post.expiresIn : null
  );

  useEffect(() => {
    if (!countdown) return;
    const interval = setInterval(() => {
      setCountdown((c) => (c && c > 1 ? c - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handlePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    if (onPress) onPress();
    else router.push(`/post/${post.id}`);
  }

  function handleLike() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggleLike(post.id);
  }

  function handleRepost() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleRepost(post.id);
  }

  function formatCountdown(secs: number): string {
    if (secs >= 3600) return `${Math.floor(secs / 3600)}h`;
    if (secs >= 60) return `${Math.floor(secs / 60)}m`;
    return `${secs}s`;
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable onPress={handlePress}>
        <View style={[styles.card, { backgroundColor: "#13132299", borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <AvatarMask avatarId={post.authorAvatar} size={38} />
            <View style={styles.headerInfo}>
              <Text style={[styles.maskName, { color: colors.text }]}>{post.authorMask}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{timeAgo(post.timestamp)}</Text>
            </View>
            <View style={[styles.moodBadge, { backgroundColor: mood.color + "22", borderColor: mood.color + "55" }]}>
              <Feather name={mood.icon as any} size={11} color={mood.color} />
              <Text style={[styles.moodText, { color: mood.color }]}>{mood.label}</Text>
            </View>
            {countdown !== null && (
              <View style={[styles.disappearBadge, { borderColor: "#ff444466" }]}>
                <Feather name="clock" size={10} color="#ff4444" />
                <Text style={styles.disappearText}>{formatCountdown(countdown)}</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.actionBtn} onPress={handleLike}>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#ff4488" : colors.textMuted}
                />
              </Animated.View>
              <Text style={[styles.actionCount, { color: isLiked ? "#ff4488" : colors.textMuted }]}>
                {formatCount(post.reactions.heart + (isLiked ? 1 : 0))}
              </Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={() => router.push(`/post/${post.id}`)}>
              <Feather name="message-circle" size={19} color={colors.textMuted} />
              <Text style={[styles.actionCount, { color: colors.textMuted }]}>{formatCount(post.comments)}</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={handleRepost}>
              <Feather name="repeat" size={19} color={isReposted ? colors.primary : colors.textMuted} />
              <Text style={[styles.actionCount, { color: isReposted ? colors.primary : colors.textMuted }]}>
                {formatCount(post.reposts + (isReposted ? 1 : 0))}
              </Text>
            </Pressable>

            <Pressable style={styles.actionBtn}>
              <Feather name="zap" size={19} color={colors.textMuted} />
              <Text style={[styles.actionCount, { color: colors.textMuted }]}>{formatCount(post.reactions.fire)}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
  },
  maskName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  disappearBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  disappearText: {
    fontSize: 10,
    color: "#ff4444",
    fontFamily: "Inter_500Medium",
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  actionCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
