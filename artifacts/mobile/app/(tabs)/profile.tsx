import { Feather } from "@expo/vector-icons";
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
import { AvatarMask } from "@/components/AvatarMask";
import { AVATAR_COLORS, AVATAR_SYMBOLS, formatCount } from "@/data/mockData";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity, posts, updateBio, upgradePremium } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(identity?.bio ?? "");

  const myPosts = posts.filter((p) => p.authorMask === identity?.mask);
  const totalReactions = myPosts.reduce(
    (acc, p) => acc + p.reactions.fire + p.reactions.heart + p.reactions.ghost + p.reactions.mind,
    0
  );

  function saveBio() {
    updateBio(bioText);
    setEditingBio(false);
  }

  if (!identity) return null;

  const accentColor = AVATAR_COLORS[identity.avatarId % AVATAR_COLORS.length];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <Pressable style={styles.iconBtn}>
          <Feather name="settings" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { borderBottomColor: colors.border }]}>
          <View style={[styles.avatarWrap, { borderColor: accentColor + "55", shadowColor: accentColor }]}>
            <AvatarMask avatarId={identity.avatarId} size={80} isPremium={identity.isPremium} />
          </View>
          <Text style={[styles.maskName, { color: colors.text }]}>{identity.mask}</Text>
          <View style={[styles.anonTag, { borderColor: colors.border }]}>
            <Feather name="eye-off" size={11} color={colors.textMuted} />
            <Text style={[styles.anonTagText, { color: colors.textMuted }]}>Anonymous Identity</Text>
          </View>

          {/* Bio */}
          {editingBio ? (
            <View style={[styles.bioInput, { borderColor: colors.primary + "55", backgroundColor: colors.surface }]}>
              <TextInput
                style={[styles.bioText, { color: colors.text }]}
                value={bioText}
                onChangeText={setBioText}
                placeholder="A few words about your mask..."
                placeholderTextColor={colors.textMuted}
                multiline
                autoFocus
              />
              <Pressable onPress={saveBio} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setEditingBio(true)} style={styles.bioRow}>
              <Text style={[styles.bioDisplay, { color: identity.bio ? colors.textSecondary : colors.textMuted }]}>
                {identity.bio || "Tap to add a bio..."}
              </Text>
              <Feather name="edit-2" size={13} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
          {[
            { label: "Posts", value: myPosts.length },
            { label: "Reactions", value: formatCount(totalReactions) },
            { label: "Soul Score", value: `${identity.soulScore}%` },
            { label: "Karma", value: formatCount(identity.karma + totalReactions) },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Premium Banner */}
        {!identity.isPremium && (
          <Pressable
            onPress={() => router.push("/premium")}
            style={[styles.premiumBanner, { backgroundColor: "#ffd70011", borderColor: "#ffd70044" }]}
          >
            <Text style={{ fontSize: 24 }}>✦</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.premiumTitle, { color: "#ffd700" }]}>Ghost Premium</Text>
              <Text style={[styles.premiumSub, { color: colors.textSecondary }]}>Unlock whisper rooms, soul boost & more</Text>
            </View>
            <Feather name="arrow-right" size={18} color="#ffd700" />
          </Pressable>
        )}

        {/* Avatar Customization */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Avatar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
            {AVATAR_SYMBOLS.map((sym, i) => (
              <Pressable key={i}>
                <View
                  style={[
                    styles.avatarOption,
                    {
                      backgroundColor: AVATAR_COLORS[i] + "22",
                      borderColor: identity.avatarId === i ? AVATAR_COLORS[i] : "transparent",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{sym}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* My Posts */}
        {myPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Posts</Text>
            {myPosts.map((p) => (
              <Pressable key={p.id} onPress={() => router.push(`/post/${p.id}`)}>
                <View style={[styles.miniPost, { backgroundColor: "#13132299", borderColor: colors.border }]}>
                  <Text style={[styles.miniPostText, { color: colors.text }]} numberOfLines={2}>{p.content}</Text>
                  <View style={styles.miniPostStats}>
                    <Feather name="heart" size={12} color={colors.textMuted} />
                    <Text style={[styles.miniStat, { color: colors.textMuted }]}>{formatCount(p.reactions.heart)}</Text>
                    <Feather name="message-circle" size={12} color={colors.textMuted} />
                    <Text style={[styles.miniStat, { color: colors.textMuted }]}>{p.comments}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.section}>
          {[
            { icon: "bell", label: "Notifications", onPress: () => router.push("/notifications") },
            { icon: "shield", label: "Privacy & Safety" },
            { icon: "moon", label: "Appearance" },
            { icon: "help-circle", label: "Help & Support" },
          ].map((item) => (
            <Pressable key={item.label} onPress={item.onPress}>
              <View style={[styles.menuRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.menuIcon, { backgroundColor: colors.surface }]}>
                  <Feather name={item.icon as any} size={16} color={colors.textSecondary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
              </View>
            </Pressable>
          ))}
        </View>
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
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  iconBtn: { padding: 8 },
  hero: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  avatarWrap: {
    borderRadius: 50,
    borderWidth: 2,
    padding: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },
  maskName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  anonTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  anonTagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  bioRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bioDisplay: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  bioInput: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  bioText: { fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 60 },
  saveBtn: { alignSelf: "flex-end", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  saveBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#000" },
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  premiumTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  premiumSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { padding: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  avatarRow: { gap: 10, paddingVertical: 4 },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  miniPost: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  miniPostText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  miniPostStats: { flexDirection: "row", alignItems: "center", gap: 6 },
  miniStat: { fontSize: 12, fontFamily: "Inter_400Regular" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
});
