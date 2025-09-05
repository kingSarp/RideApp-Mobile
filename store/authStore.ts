import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, OtpSession } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  otpSession: OtpSession | null;
  email: string | null;
  isLoading: boolean;

  // Auth actions
  login: (userData: User, token: string) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;

  // OTP session actions
  setOtpSession: (session: OtpSession) => void;
  clearOtpSession: () => void;

  // User and token setters
  setUser: (user: User) => void;
  setToken: (token: string) => void;

  // Email setter
  setEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  otpSession: null,
  email: null,
  isLoading: true, // Add initial loading state

  setEmail: (email) => set({ email }),

  setUser: (user: User) => {
    AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  setToken: (token: string) => {
    AsyncStorage.setItem("token", token);
    set({ token, isAuthenticated: true });
  },

  clearOtpSession: () => set({ otpSession: null }),

  login: async (userData, token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    set({
      user: userData,
      token: token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user"); // Also remove user data
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      otpSession: null, // Clear OTP session on logout
      email: null, // Clear email on logout
    });
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem("token");
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (token && user) {
      // set({ isLoading: true });

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setOtpSession: (session) => set({ otpSession: session }),
}));
