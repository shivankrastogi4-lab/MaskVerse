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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { AvatarMask } from "@/components/AvatarMask";
import { DEEPTALK_ROOMS, DeepTalkRoom, formatCount } from "@/data/mockData";

export default function DeepTalkScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  function joinRoom(room: DeepTalkRoom) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setJoinedRoom(room.id);
  }

  function leaveRoom() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setJoinedRoom(null);
  }

  const activeRoom = joinedRoom ? DEEPTALK_ROOMS.find((r) => r.id === joinedRoom) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>DeepTalk</Text>
        <View style={[styles.liveTag, { backgroundColor: "#ff004422", borderColor: "#ff004466" }]}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: activeRoom ? 180 : 40 }}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ANONYMOUS AUDIO ROOMS</Text>

        {DEEPTALK_ROOMS.map((room) => {
          const isJoined = joinedRoom === room.id;
          return (
            <View key={room.id} style={[styles.roomCard, { backgroundColor: isJoined ? "#00e5ff11" : "#13132299", borderColor: isJoined ? colors.primary + "66" : colors.border }]}>
              <View style={styles.roomTop}>
                <AvatarMask avatarId={room.hostAvatar} size={44} />
                <View style={styles.roomInfo}>
                  <Text style={[styles.roomTitle, { color: colors.text }]}>{room.title}</Text>
                  <Text style={[styles.roomHost, { color: colors.textMuted }]}>hosted by {room.hostMask}</Text>
                </View>
                {room.isLive && (
                  <View style={[styles.liveBadge, { backgroundColor: "#ff004422", borderColor: "#ff004466" }]}>
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

              <View style={styles.roomStats}>
                <View style={styles.stat}>
                  <Feather name="headphones" size={13} color={colors.primary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>{formatCount(room.listeners)}</Text>
                </View>
                <View style={styles.stat}>
                  <Feather name="mic" size={13} color={colors.secondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>{room.speakers} speakers</Text>
                </View>
                {room.isLive && (
                  <Pressable
                    onPress={() => isJoined ? leaveRoom() : joinRoom(room)}
                    style={[
                      styles.joinBtn,
                      { backgroundColor: isJoined ? "#ff004422" : colors.primary + "22", borderColor: isJoined ? "#ff0044" : colors.primary },
                    ]}
                  >
                    <Feather name={isJoined ? "log-out" : "headphones"} size={14} color={isJoined ? "#ff0044" : colors.primary} />
                    <Text style={[styles.joinText, { color: isJoined ? "#ff0044" : colors.primary }]}>
                      {isJoined ? "Leave" : "Join"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        {/* Create room CTA */}
        <Pressable style={[styles.createRoom, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Feather name="plus-circle" size={20} color={colors.secondary} />
          <Text style={[styles.createRoomText, { color: colors.text }]}>Start a DeepTalk Room</Text>
          <Feather name="arrow-right" size={16} color={colors.textMuted} />
        </Pressable>
      </ScrollView>

      {/* Active room bar */}
      {activeRoom && (
        <View style={[styles.activeBar, { backgroundColor: colors.surface, borderTopColor: colors.primary + "55", paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.activeLeft}>
            <View style={[styles.pulseRing, { borderColor: colors.primary }]}>
              <Feather name="mic" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.activeName, { color: colors.text }]} numberOfLines={1}>{activeRoom.title}</Text>
              <Text style={[styles.activeSub, { color: colors.textMuted }]}>{formatCount(activeRoom.listeners)} anonymous listeners</Text>
            </View>
          </View>
          <View style={styles.activeControls}>
            <Pressable
              onPress={() => { Haptics.selectionAsync(); setIsMuted(!isMuted); }}
              style={[styles.controlBtn, { backgroundColor: isMuted ? "#ff444422" : colors.muted }]}
            >
              <Feather name={isMuted ? "mic-off" : "mic"} size={18} color={isMuted ? "#ff4444" : colors.textSecondary} />
            </Pressable>
            <Pressable onPress={leaveRoom} style={[styles.leaveBtn, { backgroundColor: "#ff004422", borderColor: "#ff004466" }]}>
              <Feather name="phone-off" size={16} color="#ff0044" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 22, fontFamily: "Inter_700Bold" },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ff0044" },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#ff0044", letterSpacing: 1 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  roomCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  roomTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  roomInfo: { flex: 1 },
  roomTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  roomHost: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  tagText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  roomStats: { flexDirection: "row", alignItems: "center", gap: 14 },
  stat: { flexDirection: "row", alignItems: "center", gap: 5 },
  statText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  joinBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  joinText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  createRoom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 4,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  createRoomText: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  activeBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  activeLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  pulseRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  activeName: { fontSize: 14, fontFamily: "Inter_600SemiBold", maxWidth: 180 },
  activeSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  activeControls: { flexDirection: "row", gap: 10 },
  controlBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  leaveBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1 },
});
