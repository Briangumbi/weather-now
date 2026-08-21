import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/tokens";
import { SearchSheet } from "@/components/SearchSheet";
import { useAppStore } from "@/store/useAppStore";
import type { GeocodeResult } from "@/lib/api";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { selectPlace, addRecentSearch, recentSearches } = useAppStore();

  function handleSelect(place: GeocodeResult) {
    addRecentSearch(place);
    selectPlace({
      name: [place.name, place.admin1].filter(Boolean).join(", "),
      latitude: place.latitude,
      longitude: place.longitude,
    });
    router.back();
  }

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <SearchSheet onSelect={handleSelect} recentSearches={recentSearches} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.paper },
});
