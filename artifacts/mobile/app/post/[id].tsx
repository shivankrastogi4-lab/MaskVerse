import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { AvatarMask } from "@/components/AvatarMask";
import { MOCK_COMMENTS, Comment, formatCount, MOOD_CONFIG, timeAgo } from "@/data/mockData";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, identity, likedPosts, toggleLike } = useApp();
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(MOCK_COMMENTS[id] ?? []);

  const post = posts.find((p) => p.id === id);
  if (!post) return null;

  const mood = MOOD_CONFIG[post.mood];
  const isLiked = likedPosts.has(post.id);

  function handleComment() {
    if (!comment.trim() || !identity) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      postId: id,
      authorMask: identity.mask,
      authorAvatar: identity.avatarId,
      content: comment.trim(),
      timestamp: Date.now(),
      likes: 0,
    };
    setLocalComments((prev) => [newComment, ...prev]);
    setComment("");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={localComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.commentRow, { borderBottomColor: colors.border }]}>
            <AvatarMask avatarId={item.authorAvatar} size={34} />
            <View style={styles.commentBody}>
              <View style={styles.commentHeader}>
                <Text style={[styles.commentAuthor, { color: colors.primary }]}>{item.authorMask}</Text>
                <Text style={[styles.commentTime, { color: colors.textMuted }]}>{timeAgo(item.timestamp)}</Text>
              </View>
              <Text style={[styles.commentText, { color: colors.text }]}>{item.content}</Text>
              <Pressable style={styles.commentLike}>
                <Feather name="heart" size={12} color={colors.textMuted} />
                <Text style={[styles.commentLikeCount, { color: colors.textMuted }]}>{item.likes}</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* Post */}
            <View style={[styles.postBox, { borderBottomColor: colors.border }]}>
              <View style={styles.postHeader}>
                <AvatarMask avatarId={post.authorAvatar} size={44} />
                <View style={styles.postHeaderInfo}>
                  <Text style={[styles.maskName, { color: colors.text }]}>{post.authorMask}</Text>
                  <Text style={[styles.postTime, { color: colors.textMuted }]}>{timeAgo(post.timestamp)}</Text>
                </View>
                <View style={[styles.moodBadge, { backgroundColor: mood.color + "22", borderColor: mood.color + "44" }]}>
                  <Feather name={mood.icon as any} size={11} color={mood.color} />
                  <Text style={[styles.moodText, { color: mood.color }]}>{mood.label}</Text>
                </View>
              </View>
              <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>
              <View style={[styles.reactionBar, { borderTopColor: colors.border }]}>
                <Pressable style={styles.reactionBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleLike(post.id); }}>
                  <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? "#ff4488" : colors.textMuted} />
                  <Text style={[styles.reactionCount, { color: isLiked ? "#ff4488" : colors.textMuted }]}>
                    {formatCount(post.reactions.heart + (isLiked ? 1 : 0))}
                  </Text>
                </Pressable>
                <Pressable style={styles.reactionBtn}>
                  <Feather name="zap" size={20} color={colors.textMuted} />
                  <Text style={[styles.reactionCount, { color: colors.textMuted }]}>{formatCount(post.reactions.fire)}</Text>
                </Pressable>
                <Pressable style={styles.reactionBtn}>
                  <Feather name="repeat" size={20} color={colors.textMuted} />
                  <Text style={[styles.reactionCount, { color: colors.textMuted }]}>{formatCount(post.reposts)}</Text>
                </Pressable>
                <Pressable style={styles.reactionBtn}>
                  <Feather name="share-2" size={20} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>
            <Text style={[styles.commentsLabel, { color: colors.textMuted }]}>
              {localComments.length} COMMENTS
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.noComments}>
            <Feather name="message-circle" size={32} color={colors.textMuted} />
            <Text style={[styles.noCommentsText, { color: colors.textMuted }]}>Be the first to respond</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Comment input */}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        {identity && <AvatarMask avatarId={identity.avatarId} size={34} />}
        <TextInput
          style={[styles.commentInput, { color: colors.text, backgroundColor: colors.muted }]}
          placeholder="Reply anonymously..."
          placeholderTextColor={colors.textMuted}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Pressable onPress={handleComment} disabled={!comment.trim()}>
          <View style={[styles.sendBtn, { backgroundColor: comment.trim() ? colors.primary : colors.muted }]}>
            <Feather name="send" size={16} color={comment.trim() ? "#000" : colors.textMuted} />
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 17, fontFamily: "Inter_600SemiBold" },
  postBox: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  postHeaderInfo: { flex: 1 },
  maskName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  postTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  moodBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  moodText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  postContent: { fontSize: 17, lineHeight: 26, fontFamily: "Inter_400Regular", marginBottom: 16 },
  reactionBar: { flexDirection: "row", gap: 4, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  reactionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 4 },
  reactionCount: { fontSize: 14, fontFamily: "Inter_500Medium" },
  commentsLabel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  commentRow: { flexDirection: "row", gap: 10, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  commentBody: { flex: 1 },
  commentHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  commentTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  commentText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  commentLike: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  commentLikeCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  noComments: { alignItems: "center", gap: 10, paddingTop: 40 },
  noCommentsText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
