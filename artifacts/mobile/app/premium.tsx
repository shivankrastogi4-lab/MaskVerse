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

const PLANS = [
  { id: "monthly", label: "Monthly", price: "$4.99", per: "/month", highlight: false },
  { id: "yearly", label: "Yearly", price: "$29.99", per: "/year", badge: "Save 50%", highlight: true },
];

const FEATURES = [
  { icon: "wind", label: "Unlimited Whisper Rooms", desc: "Send vanishing whisper messages to anyone" },
  { icon: "cpu", label: "Soul Boost", desc: "10x soul match power — find your person faster" },
  { icon: "eye-off", label: "Ghost Mode", desc: "Browse and react without leaving a trace" },
  { icon: "zap", label: "Priority Feed", desc: "Your posts reach more people, more often" },
  { icon: "mic", label: "DeepTalk Host", desc: "Host unlimited live anonymous audio rooms" },
  { icon: "star", label: "Exclusive Masks", desc: "Premium avatar masks unavailable to others" },
  { icon: "shield", label: "Anti-toxicity Shield", desc: "Advanced AI filters out hate before you see it" },
  { icon: "trending-up", label: "Trending Boost", desc: "Boost your posts onto the trending board" },
];

export default function PremiumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { identity, upgradePremium } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [selectedPlan, setSelectedPlan] = useState("yearly");

  function handleUpgrade() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradePremium();
    router.back();
  }

  if (identity?.isPremium) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Ghost Premium</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.alreadyPremium}>
          <Text style={{ fontSize: 48 }}>✦</Text>
          <Text style={[styles.premiumActive, { color: "#ffd700" }]}>You're Ghost Premium</Text>
          <Text style={[styles.premiumActiveSub, { color: colors.textSecondary }]}>
            All features unlocked. The void bows to you.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Ghost Premium</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={{ fontSize: 56 }}>✦</Text>
          <Text style={[styles.heroTitle, { color: "#ffd700" }]}>Go Ghost</Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            The full anonymous experience.{"\n"}No limits. No trace.
          </Text>
        </View>

        {/* Plan selector */}
        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <Pressable key={plan.id} onPress={() => { Haptics.selectionAsync(); setSelectedPlan(plan.id); }} style={{ flex: 1 }}>
              <View
                style={[
                  styles.planCard,
                  {
                    backgroundColor: selectedPlan === plan.id ? "#ffd70011" : colors.surface,
                    borderColor: selectedPlan === plan.id ? "#ffd700" : colors.border,
                    borderWidth: selectedPlan === plan.id ? 2 : 1,
                  },
                ]}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <Text style={[styles.planLabel, { color: colors.textSecondary }]}>{plan.label}</Text>
                <Text style={[styles.planPrice, { color: selectedPlan === plan.id ? "#ffd700" : colors.text }]}>{plan.price}</Text>
                <Text style={[styles.planPer, { color: colors.textMuted }]}>{plan.per}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Features */}
        <View style={styles.featureList}>
          {FEATURES.map((f) => (
            <View key={f.label} style={[styles.featureRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: "#ffd70022" }]}>
                <Feather name={f.icon as any} size={16} color="#ffd700" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={[styles.featureLabel, { color: colors.text }]}>{f.label}</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
              </View>
              <Feather name="check" size={16} color="#ffd700" />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={handleUpgrade}
          style={[styles.cta, { backgroundColor: "#ffd700", shadowColor: "#ffd700" }]}
        >
          <Text style={{ fontSize: 22 }}>✦</Text>
          <Text style={styles.ctaText}>Unlock Ghost Premium</Text>
        </Pressable>
        <Text style={[styles.legal, { color: colors.textMuted }]}>Cancel anytime · Auto-renews · Secure</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontFamily: "Inter_700Bold" },
  hero: { alignItems: "center", padding: 32, gap: 8 },
  heroTitle: { fontSize: 36, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  plans: { flexDirection: "row", gap: 12, marginHorizontal: 16, marginBottom: 24 },
  planCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 4,
    position: "relative",
    overflow: "visible",
  },
  planBadge: {
    position: "absolute",
    top: -10,
    right: -6,
    backgroundColor: "#ff0062",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  planLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  planPrice: { fontSize: 26, fontFamily: "Inter_700Bold" },
  planPer: { fontSize: 11, fontFamily: "Inter_400Regular" },
  featureList: { paddingHorizontal: 16 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureInfo: { flex: 1 },
  featureLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  featureDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
    alignItems: "center",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#000" },
  legal: { fontSize: 11, fontFamily: "Inter_400Regular" },
  alreadyPremium: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  premiumActive: { fontSize: 26, fontFamily: "Inter_700Bold" },
  premiumActiveSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
});
