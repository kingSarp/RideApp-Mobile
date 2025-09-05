import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "../store/authStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await loadAuth();
      await SplashScreen.hideAsync(); // hide splash after auth check
    };

    init();
  }, [loadAuth]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
