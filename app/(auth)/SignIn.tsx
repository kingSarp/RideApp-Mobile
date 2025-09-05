// SignIn.tsx

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StatusBar,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "../../Components/CustomTextInput";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
// import { login } from "../../services/authService";
// import { useAuthStore } from "../../store/authStore";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [loginError, setLoginError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  React.useEffect(() => {
    // Entrance animation
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [slideUpAnim]);

  const showErrorWithAnimation = (message: string) => {
    setLoginError(message);

    fadeAnim.setValue(0);
    Animated.spring(fadeAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const hideError = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setLoginError("");
    });
  };

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();
      if (loginError) hideError();

      // const result = await login({
      // email: data.email,
      //   password: data.password,
      // });

      // useAuthStore.getState().login(result.user.email, result.token);
      router.push("/(tabs)/index");
    } catch (error: any) {
      console.error("Login error:", error);

      if (error?.response?.status === 401) {
        setError("password", {
          type: "manual",
          message: "Incorrect email or password",
        });
        triggerShake();
      } else if (error?.response?.status === 429) {
        showErrorWithAnimation(
          "Too many login attempts. Please try again later."
        );
      } else if (error?.response?.status >= 500) {
        Alert.alert(
          "Service Unavailable",
          "We're experiencing technical issues. Try again later."
        );
      } else if (!error?.response) {
        showErrorWithAnimation("Check your internet connection and try again.");
      } else {
        showErrorWithAnimation("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <Animated.View
              style={[
                styles.logoSection,
                { transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>RIDE</Text>
              </View>
            </Animated.View>

            {/* Form Section */}
            <Animated.View
              style={[
                styles.formSection,
                { transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.subtitleText}>
                  Sign in to continue your journey
                </Text>
              </View>

              {loginError && (
                <Animated.View
                  style={[styles.errorContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{loginError}</Text>
                  </View>
                </Animated.View>
              )}

              <Animated.View
                style={[
                  styles.inputContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <CustomTextInput
                      label="Email"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (loginError) hideError();
                        clearErrors("password");
                      }}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <CustomTextInput
                      label="Password"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (loginError) hideError();
                        clearErrors("password");
                      }}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                    />
                  )}
                />

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => console.log("Forgot password pressed")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  isSubmitting && styles.signInButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>
                  {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/SignUp")}>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#666666",
    fontWeight: "300",
  },
  timerContainer: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoContainer: {
    width: 120,
    height: 60,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
  formSection: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#C62828",
    fontWeight: "500",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 32,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
  },
  signInButton: {
    height: 56,
    backgroundColor: "#FFD700",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "400",
  },
  footerLink: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
});
