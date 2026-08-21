import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, type } from "@/theme/tokens";
import { searchPlaces, GeocodeResult } from "@/lib/api";

interface SearchSheetProps {
  onSelect: (place: GeocodeResult) => void;
  onUseCurrentLocation: () => void;
  recentSearches: GeocodeResult[];
}

export function SearchSheet({ onSelect, onUseCurrentLocation, recentSearches }: SearchSheetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const found = await searchPlaces(trimmed);
        setResults(found);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  const listData = query.trim() ? results : recentSearches;

  return (
    <View style={styles.wrap}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search for a city"
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoFocus
        autoCorrect={false}
      />
      <Pressable style={styles.currentLocationRow} onPress={onUseCurrentLocation}>
        <Ionicons name="locate" size={16} color={colors.accent} />
        <Text style={styles.currentLocationText}>Use current location</Text>
      </Pressable>
      {loading && <ActivityIndicator style={{ marginTop: 12 }} color={colors.accent} />}
      {!loading && query.trim() && !results.length && (
        <Text style={styles.empty}>No places found. Try a different spelling.</Text>
      )}
      {!query.trim() && recentSearches.length > 0 && (
        <Text style={styles.sectionLabel}>Recent</Text>
      )}
      <FlatList
        data={listData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => onSelect(item)}>
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Text style={styles.rowSubtitle}>
              {[item.admin1, item.country].filter(Boolean).join(", ")}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  input: {
    fontFamily: type.bodyMedium,
    fontSize: 20,
    color: colors.textDark,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    paddingBottom: 10,
  },
  currentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  currentLocationText: {
    fontFamily: type.bodyMedium,
    fontSize: 15,
    color: colors.accent,
  },
  empty: {
    fontFamily: type.body,
    color: colors.muted,
    marginTop: 16,
    fontSize: 14,
  },
  sectionLabel: {
    fontFamily: type.mono,
    color: colors.muted,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowTitle: {
    fontFamily: type.bodyMedium,
    fontSize: 16,
    color: colors.textDark,
  },
  rowSubtitle: {
    fontFamily: type.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
});
