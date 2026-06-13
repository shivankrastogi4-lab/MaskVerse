import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { AvatarMask } from "@/components/AvatarMask";
import { ChatMessage, MOCK_CHATS, MOCK_MESSAGES, timeAgo } from "@/data/mockData";

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity } = useApp();
  const flatRef = useRef<FlatList>(null);

  const thread = MOCK_CHATS.find((c) => c.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>(
    (MOCK_MESSAGES[id] ?? []).slice().reverse()
  );
  const [input, setInput] = useState("");
  const [whisperMode, setWhisperMode] = useState(thread?.isWhisper ?? false);

  function sendMessage() {
    if (!input.trim() || !identity) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msg: ChatMessage = {
      id: `m_${Date.now()}`,
      threadId: id,
      sender: "me",
      content: input.trim(),
      timestamp: Date.now(),
      isWhisper: whisperMode,
      burned: false,
    };
    setMessages((prev) => [msg, ...prev]);
    setInput("");
  }

  if (!thread) return null;

  function renderMessage({ item }: { item: ChatMessage }) {
    const isMe = item.sender === "me";
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRight : styles.msgLeft]}>
        {!isMe && <AvatarMask avatarId={thread!.peerAvatar} size={28} />}
        <View
          style={[
            styles.bubble,
            isMe
              ? { backgroundColor: item.isWhisper ? "#ff006233" : colors.primary + "33", borderColor: item.isWhisper ? "#ff006266" : colors.primary + "66" }
              : { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {item.isWhisper && (
            <View style={styles.whisperLabel}>
              <Feather name="wind" size={10} color="#ff0062" />
              <Text style={styles.whisperLabelText}>Whisper</Text>
            </View>
          )}
          <Text style={[styles.bubbleText, { color: colors.text }]}>{item.content}</Text>
          <Text style={[styles.bubbleTime, { color: colors.textMuted }]}>{timeAgo(item.timestamp)}</Text>
        </View>
        {isMe && identity && <AvatarMask avatarId={identity.avatarId} size={28} />}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <AvatarMask avatarId={thread.peerAvatar} size={36} isSoulMatch={thread.isSoulMatch} />
        <View style={styles.headerInfo}>
          <Text style={[styles.peerName, { color: colors.text }]}>{thread.peerMask}</Text>
          {thread.isSoulMatch && <Text style={[styles.soulTag, { color: "#b400ff" }]}>Soul Match</Text>}
        </View>
        <View style={styles.headerRight}>
          <Feather name="phone" size={20} color={colors.textSecondary} />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={[styles.msgList, { paddingBottom: 16 }]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setWhisperMode(!whisperMode); }}
          style={[styles.whisperToggle, { borderColor: whisperMode ? "#ff0062" : colors.border, backgroundColor: whisperMode ? "#ff006222" : "transparent" }]}
        >
          <Feather name="wind" size={16} color={whisperMode ? "#ff0062" : colors.textMuted} />
        </Pressable>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.muted, borderColor: whisperMode ? "#ff006244" : "transparent" }]}
          placeholder={whisperMode ? "Whisper something..." : "Message..."}
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <Pressable onPress={sendMessage} disabled={!input.trim()}>
          <View style={[styles.sendBtn, { backgroundColor: input.trim() ? (whisperMode ? "#ff0062" : colors.primary) : colors.muted }]}>
            <Feather name="send" size={16} color={input.trim() ? "#000" : colors.textMuted} />
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerInfo: { flex: 1 },
  peerName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  soulTag: { fontSize: 11, fontFamily: "Inter_500Medium" },
  headerRight: { flexDirection: "row", gap: 12, paddingRight: 4 },
  msgList: { paddingHorizontal: 14, paddingTop: 16 },
  msgRow: { flexDirection: "row", gap: 8, marginBottom: 12, alignItems: "flex-end" },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "72%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    gap: 3,
  },
  whisperLabel: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  whisperLabelText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#ff0062" },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bubbleTime: { fontSize: 10, fontFamily: "Inter_400Regular", alignSelf: "flex-end" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  whisperToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxHeight: 80,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
