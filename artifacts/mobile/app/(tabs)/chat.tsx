import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { AvatarMask } from "@/components/AvatarMask";
import { ChatThread, timeAgo } from "@/data/mockData";
import { MOCK_CHATS } from "@/data/mockData";

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function renderItem({ item }: { item: ChatThread }) {
    return (
      <Pressable onPress={() => router.push(`/chatroom/${item.id}`)}>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={{ position: "relative" }}>
            <AvatarMask avatarId={item.peerAvatar} size={50} isSoulMatch={item.isSoulMatch} />
            {item.isWhisper && (
              <View style={[styles.whisperBadge, { backgroundColor: "#ff0062" }]}>
                <Feather name="wind" size={9} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.info}>
            <View style={styles.topRow}>
              <Text style={[styles.peerName, { color: colors.text }]}>{item.peerMask}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{timeAgo(item.lastTime)}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text
                style={[styles.preview, { color: item.unread > 0 ? colors.text : colors.textMuted }]}
                numberOfLines={1}
              >
                {item.isWhisper ? `🌬 ${item.lastMessage}` : item.lastMessage}
              </Text>
              {item.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
            <View style={styles.badges}>
              {item.isSoulMatch && (
                <View style={[styles.badge, { backgroundColor: "#b400ff22", borderColor: "#b400ff55" }]}>
                  <Text style={[styles.badgeText, { color: "#b400ff" }]}>Soul Match</Text>
                </View>
              )}
              {item.isWhisper && (
                <View style={[styles.badge, { backgroundColor: "#ff006222", borderColor: "#ff006255" }]}>
                  <Text style={[styles.badgeText, { color: "#ff0062" }]}>Whisper</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <Pressable style={[styles.newChat, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "55" }]}>
          <Feather name="edit-2" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={[styles.whisperBanner, { backgroundColor: "#ff006211", borderColor: "#ff006244" }]}>
            <Feather name="wind" size={16} color="#ff0062" />
            <Text style={[styles.whisperText, { color: colors.text }]}>Whisper to anyone anonymously</Text>
            <Feather name="arrow-right" size={14} color="#ff0062" />
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
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  newChat: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  whisperBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  whisperText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  info: { flex: 1 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 },
  peerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  time: { fontSize: 12, fontFamily: "Inter_400Regular" },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  preview: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#000" },
  badges: { flexDirection: "row", gap: 6 },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  whisperBadge: {
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
