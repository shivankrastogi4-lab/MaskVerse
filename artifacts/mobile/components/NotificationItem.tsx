import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Notification, timeAgo } from "@/data/mockData";
import { AvatarMask } from "./AvatarMask";
import { useColors } from "@/hooks/useColors";

const TYPE_CONFIG = {
  reaction:   { icon: "zap" as const,        color: "#ff4400" },
  comment:    { icon: "message-circle" as const, color: "#00e5ff" },
  repost:     { icon: "repeat" as const,     color: "#00ff99" },
  soul_match: { icon: "heart" as const,      color: "#b400ff" },
  whisper:    { icon: "wind" as const,       color: "#ff0062" },
  system:     { icon: "star" as const,       color: "#ffd700" },
};

interface NotificationItemProps {
  item: Notification;
}

export function NotificationItem({ item }: NotificationItemProps) {
  const colors = useColors();
  const cfg = TYPE_CONFIG[item.type];

  return (
    <View style={[styles.row, { opacity: item.read ? 0.6 : 1, borderBottomColor: colors.border }]}>
      <View style={{ position: "relative" }}>
        {item.actorAvatar >= 0 ? (
          <AvatarMask avatarId={item.actorAvatar} size={42} isSoulMatch={item.type === "soul_match"} />
        ) : (
          <View style={[styles.sysAvatar, { backgroundColor: cfg.color + "22", borderColor: cfg.color + "44" }]}>
            <Feather name={cfg.icon} size={18} color={cfg.color} />
          </View>
        )}
        <View style={[styles.typeBadge, { backgroundColor: cfg.color }]}>
          <Feather name={cfg.icon} size={9} color="#000" />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.actor, { color: colors.text }]}>
          <Text style={{ color: cfg.color }}>{item.actorMask} </Text>
          {item.content}
        </Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>{timeAgo(item.timestamp)}</Text>
      </View>

      {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sysAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  typeBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  actor: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
