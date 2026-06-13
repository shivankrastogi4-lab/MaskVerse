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
import { DeepTalkCard } from "@/components/DeepTalkCard";
import { TrendingTag } from "@/components/TrendingTag";
import { DEEPTALK_ROOMS, TRENDING_TOPICS } from "@/data/mockData";
import { AvatarMask } from "@/components/AvatarMask";
import { useApp } from "@/context/AppContext";

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity } = useApp();
  const [search, setSearch] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}
      >
        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search topics, masks, rooms..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Soul Match Banner */}
        <Pressable style={[styles.soulBanner, { borderColor: "#b400ff55", backgroundColor: "#b400ff11" }]}>
          <View style={styles.soulLeft}>
            <Text style={styles.soulEmoji}>🔮</Text>
            <View>
              <Text style={[styles.soulTitle, { color: colors.text }]}>Soul Match</Text>
              <Text style={[styles.soulSub, { color: colors.textSecondary }]}>AI finds your anonymous kindred spirit</Text>
            </View>
          </View>
          <View style={styles.soulMatch}>
            {identity && <AvatarMask avatarId={identity.avatarId} size={36} />}
            <View style={[styles.matchPercent, { backgroundColor: "#b400ff" }]}>
              <Text style={styles.matchText}>{identity?.soulScore ?? 87}%</Text>
            </View>
            <AvatarMask avatarId={6} size={36} isSoulMatch />
          </View>
        </Pressable>

        {/* DeepTalk Rooms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="mic" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>DeepTalk Rooms</Text>
            <View style={[styles.liveTag, { backgroundColor: "#ff004422", borderColor: "#ff004466" }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          {DEEPTALK_ROOMS.map((room) => (
            <DeepTalkCard key={room.id} room={room} onPress={() => router.push("/deeptalk")} />
          ))}
        </View>

        {/* Trending Topics */}
        <View style={[styles.section, { marginTop: 4 }]}>
          <View style={styles.sectionHeader}>
            <Feather name="trending-up" size={16} color={colors.secondary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending</Text>
          </View>
          <View style={[styles.trendingCard, { backgroundColor: "#13132299", borderColor: colors.border }]}>
            {TRENDING_TOPICS.map((topic, i) => (
              <TrendingTag key={topic.id} topic={topic} rank={i + 1} />
            ))}
          </View>
        </View>

        {/* Premium Banner */}
        <Pressable
          onPress={() => router.push("/premium")}
          style={[styles.premiumBanner, { borderColor: "#ffd70055", backgroundColor: "#ffd70011" }]}
        >
          <Text style={styles.premiumIcon}>✦</Text>
          <View style={styles.premiumInfo}>
            <Text style={[styles.premiumTitle, { color: "#ffd700" }]}>Go Ghost Premium</Text>
            <Text style={[styles.premiumSub, { color: colors.textSecondary }]}>Whisper rooms, soul boost, no limits</Text>
          </View>
          <Feather name="arrow-right" size={18} color="#ffd700" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  soulBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  soulLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  soulEmoji: { fontSize: 28 },
  soulTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  soulSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  soulMatch: { flexDirection: "row", alignItems: "center", gap: 6 },
  matchPercent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", flex: 1 },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ff0044" },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#ff0044", letterSpacing: 1 },
  trendingCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  premiumIcon: { fontSize: 28, color: "#ffd700" },
  premiumInfo: { flex: 1 },
  premiumTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  premiumSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});
