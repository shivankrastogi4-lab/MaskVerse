import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AVATAR_COLORS, AVATAR_SYMBOLS } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const STORY_USERS = [
  { id: "s1", mask: "VoidSerpent19", avatarId: 2, seen: false },
  { id: "s2", mask: "DarkOracle∞", avatarId: 5, seen: false },
  { id: "s3", mask: "CipherMoth404", avatarId: 6, seen: true },
  { id: "s4", mask: "GlitchRaven13", avatarId: 4, seen: false },
  { id: "s5", mask: "NeonReaper88", avatarId: 13, seen: true },
  { id: "s6", mask: "QuantumVeil0x", avatarId: 7, seen: false },
  { id: "s7", mask: "MirrorDemon13", avatarId: 8, seen: true },
];

export function StoryRow() {
  const colors = useColors();
  const { identity } = useApp();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* My story */}
      <View style={styles.storyItem}>
        <View style={[styles.addStory, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ fontSize: 22 }}>
            {identity ? AVATAR_SYMBOLS[identity.avatarId % AVATAR_SYMBOLS.length] : "👁"}
          </Text>
          <View style={[styles.plusBadge, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={10} color="#000" />
          </View>
        </View>
        <Text style={[styles.storyName, { color: colors.textMuted }]} numberOfLines={1}>
          Your Mask
        </Text>
      </View>

      {STORY_USERS.map((s) => {
        const color = AVATAR_COLORS[s.avatarId % AVATAR_COLORS.length];
        const symbol = AVATAR_SYMBOLS[s.avatarId % AVATAR_SYMBOLS.length];
        return (
          <View key={s.id} style={styles.storyItem}>
            <View
              style={[
                styles.storyRing,
                {
                  borderColor: s.seen ? colors.border : color,
                  borderWidth: s.seen ? 1 : 2,
                  shadowColor: s.seen ? "transparent" : color,
                },
              ]}
            >
              <View style={[styles.storyAvatar, { backgroundColor: color + "22" }]}>
                <Text style={{ fontSize: 22 }}>{symbol}</Text>
              </View>
            </View>
            <Text style={[styles.storyName, { color: s.seen ? colors.textMuted : colors.text }]} numberOfLines={1}>
              {s.mask.slice(0, 9)}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
  },
  storyItem: {
    alignItems: "center",
    gap: 5,
    width: 62,
  },
  storyRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  storyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  storyName: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  addStory: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  plusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
