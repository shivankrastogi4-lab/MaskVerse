import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { MoodFilter } from "@/components/MoodFilter";
import { PostCard } from "@/components/PostCard";
import { StoryRow } from "@/components/StoryRow";
import { MoodTag } from "@/data/mockData";

export default function FeedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { posts, unreadCount } = useApp();
  const [moodFilter, setMoodFilter] = useState<MoodTag | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = moodFilter === "all" ? posts : posts.filter((p) => p.mood === moodFilter);

  async function onRefresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🎭</Text>
          <Text style={[styles.logoText, { color: colors.text }]}>
            <Text style={{ color: colors.primary }}>Mask</Text>
            <Text style={{ color: colors.secondary }}>Verse</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/notifications")} style={styles.iconBtn}>
            <Feather name="bell" size={22} color={colors.textSecondary} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="search" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            <StoryRow />
            <MoodFilter selected={moodFilter} onSelect={setMoodFilter} />
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="wind" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>The void is quiet…</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}
        showsVerticalScrollIndicator={false}
      />
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
  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoIcon: { fontSize: 22 },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  headerRight: { flexDirection: "row", gap: 4 },
  iconBtn: { padding: 8, position: "relative" },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, color: "#fff", fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium" },
});
