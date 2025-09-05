import { Stack } from "expo-router";

export default function _Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="VerifyOtp" />
      <Stack.Screen name="CompleteProfile" />
    </Stack>
  );
}
