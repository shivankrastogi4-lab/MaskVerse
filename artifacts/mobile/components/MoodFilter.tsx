import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MoodTag, MOOD_CONFIG } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface MoodFilterProps {
  selected: MoodTag | "all";
  onSelect: (mood: MoodTag | "all") => void;
}

const ALL_MOODS: (MoodTag | "all")[] = ["all", "fire", "confession", "dark", "chill", "love", "rant", "advice", "chaos"];

export function MoodFilter({ selected, onSelect }: MoodFilterProps) {
  const colors = useColors();

  function handleSelect(mood: MoodTag | "all") {
    Haptics.selectionAsync();
    onSelect(mood);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {ALL_MOODS.map((mood) => {
        const isSelected = selected === mood;
        const config = mood !== "all" ? MOOD_CONFIG[mood] : null;
        const color = config?.color ?? colors.primary;

        return (
          <Pressable
            key={mood}
            onPress={() => handleSelect(mood)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? color + "33" : "#13132266",
                borderColor: isSelected ? color : colors.border,
              },
            ]}
          >
            {mood !== "all" && config && (
              <Feather name={config.icon as any} size={12} color={isSelected ? color : colors.textMuted} />
            )}
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? color : colors.textMuted },
              ]}
            >
              {mood === "all" ? "All" : config!.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
