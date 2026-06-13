import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCount, TrendingTopic } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface TrendingTagProps {
  topic: TrendingTopic;
  rank: number;
  onPress?: () => void;
}

export function TrendingTag({ topic, rank, onPress }: TrendingTagProps) {
  const colors = useColors();

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rank, { color: colors.textMuted }]}>#{rank}</Text>
        <View style={styles.info}>
          <Text style={[styles.tag, { color: colors.text }]}>{topic.tag}</Text>
          <Text style={[styles.count, { color: colors.textMuted }]}>{formatCount(topic.posts)} posts</Text>
        </View>
        {topic.rising && (
          <View style={[styles.risingBadge, { backgroundColor: "#00ff9922", borderColor: "#00ff9944" }]}>
            <Feather name="trending-up" size={11} color="#00ff99" />
            <Text style={styles.risingText}>Rising</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rank: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    width: 24,
  },
  info: { flex: 1 },
  tag: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  count: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  risingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  risingText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#00ff99",
  },
});
