import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function NeonButton({
  label,
  onPress,
  color,
  variant = "solid",
  size = "md",
  disabled = false,
  style,
  fullWidth = false,
}: NeonButtonProps) {
  const colors = useColors();
  const btnColor = color ?? colors.primary;
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 70, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 70, useNativeDriver: true }),
    ]).start();
    onPress();
  }

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13, borderRadius: 10 },
    md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15, borderRadius: 14 },
    lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 17, borderRadius: 16 },
  };

  const sz = sizeStyles[size];

  const bgColor = variant === "solid" ? btnColor : "transparent";
  const borderColor = variant === "ghost" ? "transparent" : btnColor;
  const textColor = variant === "solid" ? "#000" : btnColor;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && styles.fullWidth]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.btn,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: variant === "ghost" ? 0 : 1.5,
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
            borderRadius: sz.borderRadius,
            opacity: disabled ? 0.4 : 1,
            shadowColor: variant === "solid" ? btnColor : "transparent",
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Text style={[styles.label, { color: textColor, fontSize: sz.fontSize }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
});
