import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, SpaceGrotesk_700Bold, SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono";
import { useAppStore } from "@/store/useAppStore";

SplashScreen.preventAutoHideAsync();

function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  return hydrated;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    IBMPlexMono_400Regular,
  });
  const storeHydrated = useStoreHydrated();
  const ready = fontsLoaded && storeHydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="search"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
