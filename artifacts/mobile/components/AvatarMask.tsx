import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AVATAR_COLORS, AVATAR_SYMBOLS } from "@/data/mockData";

interface AvatarMaskProps {
  avatarId: number;
  size?: number;
  showBorder?: boolean;
  isPremium?: boolean;
  isSoulMatch?: boolean;
}

export function AvatarMask({ avatarId, size = 44, showBorder = true, isPremium = false, isSoulMatch = false }: AvatarMaskProps) {
  const safeId = Math.abs(avatarId) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[safeId];
  const symbol = AVATAR_SYMBOLS[safeId];
  const fontSize = size * 0.42;

  const borderColor = isPremium ? "#ffd700" : isSoulMatch ? "#b400ff" : color + "66";

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + "22",
          borderWidth: showBorder ? 1.5 : 0,
          borderColor,
        },
      ]}
    >
      <Text style={{ fontSize }}>{symbol}</Text>
      {isPremium && (
        <View style={[styles.badge, { backgroundColor: "#ffd700" }]}>
          <Text style={styles.badgeText}>✦</Text>
        </View>
      )}
      {isSoulMatch && !isPremium && (
        <View style={[styles.badge, { backgroundColor: "#b400ff" }]}>
          <Text style={styles.badgeText}>♾</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 8,
    color: "#000",
  },
});
