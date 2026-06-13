import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DeepTalkRoom, formatCount } from "@/data/mockData";
import { AvatarMask } from "./AvatarMask";
import { useColors } from "@/hooks/useColors";

interface DeepTalkCardProps {
  room: DeepTalkRoom;
  onPress?: () => void;
}

export function DeepTalkCard({ room, onPress }: DeepTalkCardProps) {
  const colors = useColors();

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.card, { backgroundColor: "#13132299", borderColor: room.isLive ? "#00e5ff33" : colors.border }]}>
        <View style={styles.top}>
          <AvatarMask avatarId={room.hostAvatar} size={40} />
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{room.title}</Text>
            <Text style={[styles.host, { color: colors.textMuted }]}>by {room.hostMask}</Text>
          </View>
          {room.isLive && (
            <View style={[styles.liveBadge, { backgroundColor: "#ff004433", borderColor: "#ff004488" }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.tags}>
          {room.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Feather name="headphones" size={13} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>{formatCount(room.listeners)} listening</Text>
          </View>
          <View style={styles.stat}>
            <Feather name="mic" size={13} color={colors.secondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>{room.speakers} speaking</Text>
          </View>
          <View style={styles.joinBtn}>
            <Text style={[styles.joinText, { color: room.isLive ? colors.primary : colors.textMuted }]}>
              {room.isLive ? "Join Room" : "Scheduled"}
            </Text>
            <Feather name="arrow-right" size={12} color={room.isLive ? colors.primary : colors.textMuted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  host: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff0044",
  },
  liveText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#ff0044",
    letterSpacing: 1,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  joinBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  joinText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
