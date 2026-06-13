import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { MoodTag, MOOD_CONFIG, generateAvatarId, generateMask, Post } from "@/data/mockData";
import { AvatarMask } from "@/components/AvatarMask";

const MOODS = Object.entries(MOOD_CONFIG) as [MoodTag, (typeof MOOD_CONFIG)[MoodTag]][];

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity, addPost } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodTag>("chill");
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [duration, setDuration] = useState(3600);

  const charLimit = 280;
  const remaining = charLimit - content.length;

  function handlePost() {
    if (!content.trim() || !identity) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const post: Post = {
      id: `p_${Date.now()}`,
      authorMask: identity.mask,
      authorAvatar: identity.avatarId,
      content: content.trim(),
      mood,
      reactions: { fire: 0, heart: 0, ghost: 0, mind: 0 },
      comments: 0,
      reposts: 0,
      timestamp: Date.now(),
      isDisappearing,
      expiresIn: isDisappearing ? duration : undefined,
    };
    addPost(post);
    setContent("");
    router.push("/(tabs)/feed");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>New Post</Text>
        <View style={[styles.anonBadge, { backgroundColor: "#00e5ff11", borderColor: "#00e5ff44" }]}>
          <Feather name="eye-off" size={12} color={colors.primary} />
          <Text style={[styles.anonText, { color: colors.primary }]}>Anonymous</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {/* Author preview */}
        <View style={styles.authorRow}>
          {identity && <AvatarMask avatarId={identity.avatarId} size={42} />}
          <View>
            <Text style={[styles.maskName, { color: colors.text }]}>{identity?.mask ?? "Anonymous"}</Text>
            <Text style={[styles.authorSub, { color: colors.textMuted }]}>Your identity is hidden</Text>
          </View>
        </View>

        {/* Text area */}
        <View style={[styles.textBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="What's on your mind? No one will know it's you..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={charLimit}
            value={content}
            onChangeText={setContent}
            autoFocus
          />
          <Text style={[styles.charCount, { color: remaining < 30 ? colors.destructive : colors.textMuted }]}>
            {remaining}
          </Text>
        </View>

        {/* Mood picker */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>MOOD</Text>
        <View style={styles.moodGrid}>
          {MOODS.map(([key, cfg]) => (
            <Pressable key={key} onPress={() => { Haptics.selectionAsync(); setMood(key); }}>
              <View
                style={[
                  styles.moodChip,
                  {
                    backgroundColor: mood === key ? cfg.color + "33" : colors.surface,
                    borderColor: mood === key ? cfg.color : colors.border,
                  },
                ]}
              >
                <Feather name={cfg.icon as any} size={13} color={mood === key ? cfg.color : colors.textMuted} />
                <Text style={[styles.moodLabel, { color: mood === key ? cfg.color : colors.textMuted }]}>
                  {cfg.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Disappearing toggle */}
        <View style={[styles.optionRow, { borderColor: colors.border }]}>
          <View style={styles.optionLeft}>
            <Feather name="clock" size={16} color={isDisappearing ? "#ff4444" : colors.textMuted} />
            <View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Disappearing Post</Text>
              <Text style={[styles.optionSub, { color: colors.textMuted }]}>Auto-delete after time limit</Text>
            </View>
          </View>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setIsDisappearing(!isDisappearing); }}
            style={[styles.toggle, { backgroundColor: isDisappearing ? "#ff444466" : colors.muted, borderColor: isDisappearing ? "#ff4444" : colors.border }]}
          >
            <View style={[styles.toggleThumb, { backgroundColor: isDisappearing ? "#ff4444" : colors.textMuted, marginLeft: isDisappearing ? 18 : 2 }]} />
          </Pressable>
        </View>

        {isDisappearing && (
          <View style={styles.durationRow}>
            {[
              { label: "1h", val: 3600 },
              { label: "6h", val: 21600 },
              { label: "24h", val: 86400 },
              { label: "48h", val: 172800 },
            ].map((d) => (
              <Pressable key={d.val} onPress={() => setDuration(d.val)}>
                <View
                  style={[
                    styles.durChip,
                    {
                      backgroundColor: duration === d.val ? "#ff444433" : colors.surface,
                      borderColor: duration === d.val ? "#ff4444" : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.durText, { color: duration === d.val ? "#ff4444" : colors.textMuted }]}>
                    {d.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Post button */}
        <Pressable
          onPress={handlePost}
          disabled={!content.trim()}
          style={[
            styles.postBtn,
            {
              backgroundColor: content.trim() ? colors.primary : colors.muted,
              shadowColor: content.trim() ? colors.primary : "transparent",
            },
          ]}
        >
          <Feather name="send" size={18} color={content.trim() ? "#000" : colors.textMuted} />
          <Text style={[styles.postText, { color: content.trim() ? "#000" : colors.textMuted }]}>
            Post Anonymously
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  anonBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  anonText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  body: { padding: 16, gap: 16 },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  maskName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  authorSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  textBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    minHeight: 140,
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  moodLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  optionTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  optionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  durationRow: {
    flexDirection: "row",
    gap: 8,
  },
  durChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  durText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  postText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
