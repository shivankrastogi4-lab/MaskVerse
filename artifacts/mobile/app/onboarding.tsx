import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { AVATAR_COLORS, AVATAR_SYMBOLS, generateMask } from "@/data/mockData";

const { width: SCREEN_W } = Dimensions.get("window");

const SUGGESTED_MASKS = Array.from({ length: 8 }, generateMask);

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(0);
  const [selectedMask, setSelectedMask] = useState(SUGGESTED_MASKS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [customMask, setCustomMask] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;

  function goNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 2) {
      Animated.timing(slideAnim, { toValue: -(step + 1) * SCREEN_W, duration: 350, useNativeDriver: true }).start();
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  async function handleFinish() {
    const finalMask = customMask.trim() || selectedMask;
    await completeOnboarding(finalMask, selectedAvatar);
    router.replace("/(tabs)/feed");
  }

  function selectMask(m: string) {
    Haptics.selectionAsync();
    setSelectedMask(m);
  }

  function selectAvatar(id: number) {
    Haptics.selectionAsync();
    setSelectedAvatar(id);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Step dots */}
      <View style={[styles.dots, { top: insets.top + 16 }]}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === step ? colors.primary : colors.border,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.slides, { transform: [{ translateX: slideAnim }] }]}>
        {/* Step 0: Welcome */}
        <View style={[styles.slide, { paddingTop: insets.top + 60 }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎭</Text>
            <Text style={[styles.logoText, { color: colors.primary }]}>MASK</Text>
            <Text style={[styles.logoText, { color: colors.secondary }]}>VERSE</Text>
          </View>
          <Text style={[styles.tagline, { color: colors.text }]}>
            Your identity, hidden.{"\n"}Your truth, set free.
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Connect with millions worldwide{"\n"}without revealing who you are.
          </Text>

          <View style={styles.features}>
            {[
              { icon: "eye-off", label: "100% Anonymous", color: colors.primary },
              { icon: "globe", label: "Global Community", color: colors.secondary },
              { icon: "wind", label: "Whisper & Disappear", color: "#ff0062" },
              { icon: "cpu", label: "AI Soul Matching", color: colors.gold },
            ].map((f) => (
              <View key={f.label} style={[styles.featureRow, { borderColor: colors.border }]}>
                <View style={[styles.featureIcon, { backgroundColor: f.color + "22" }]}>
                  <Feather name={f.icon as any} size={16} color={f.color} />
                </View>
                <Text style={[styles.featureLabel, { color: colors.text }]}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step 1: Pick Avatar */}
        <View style={[styles.slide, { paddingTop: insets.top + 60 }]}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Your Mask</Text>
          <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
            This is your face in MaskVerse. No one will know the real you.
          </Text>

          <View style={[styles.selectedPreview, { borderColor: AVATAR_COLORS[selectedAvatar] + "66" }]}>
            <Text style={{ fontSize: 48 }}>{AVATAR_SYMBOLS[selectedAvatar]}</Text>
            <View style={[styles.glowRing, { borderColor: AVATAR_COLORS[selectedAvatar] + "44" }]} />
          </View>

          <FlatList
            data={AVATAR_SYMBOLS}
            numColumns={5}
            keyExtractor={(_, i) => `${i}`}
            scrollEnabled={false}
            contentContainerStyle={styles.avatarGrid}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => selectAvatar(index)} style={styles.avatarCell}>
                <View
                  style={[
                    styles.avatarOption,
                    {
                      backgroundColor: AVATAR_COLORS[index] + "22",
                      borderColor: selectedAvatar === index ? AVATAR_COLORS[index] : "transparent",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{item}</Text>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* Step 2: Pick Mask Name */}
        <View style={[styles.slide, { paddingTop: insets.top + 60 }]}>
          <Text style={[styles.stepTitle, { color: colors.text }]}>Your Anonymous Name</Text>
          <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
            Auto-generated for you. Tap any to select, or keep yours.
          </Text>

          <View style={styles.suggestedMasks}>
            {SUGGESTED_MASKS.map((m) => (
              <Pressable key={m} onPress={() => selectMask(m)}>
                <View
                  style={[
                    styles.maskChip,
                    {
                      backgroundColor: selectedMask === m ? colors.primary + "22" : colors.surface,
                      borderColor: selectedMask === m ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.maskChipText, { color: selectedMask === m ? colors.primary : colors.text }]}>
                    {m}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={[styles.selectedMaskDisplay, { borderColor: colors.primary + "44" }]}>
            <Text style={[styles.selectedMaskLabel, { color: colors.textMuted }]}>Your mask will be</Text>
            <Text style={[styles.selectedMaskName, { color: colors.primary }]}>{selectedMask}</Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA */}
      <Pressable
        onPress={goNext}
        style={[
          styles.cta,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + 32,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.ctaText}>{step < 2 ? "Continue" : "Enter MaskVerse"}</Text>
        <Feather name={step < 2 ? "arrow-right" : "log-in"} size={20} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  dots: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  dot: { height: 8, borderRadius: 4 },
  slides: {
    flexDirection: "row",
    width: SCREEN_W * 3,
  },
  slide: {
    width: SCREEN_W,
    paddingHorizontal: 28,
    paddingBottom: 140,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 20,
  },
  logoIcon: { fontSize: 40 },
  logoText: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    marginBottom: 36,
  },
  features: { gap: 10 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  stepTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  stepSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  selectedPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginBottom: 20,
  },
  glowRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
  },
  avatarGrid: { alignSelf: "center" },
  avatarCell: { padding: 6 },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestedMasks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 24,
  },
  maskChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  maskChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  selectedMaskDisplay: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectedMaskLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  selectedMaskName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  cta: {
    position: "absolute",
    left: 28,
    right: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#000",
  },
});
