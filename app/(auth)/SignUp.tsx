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
  ImageBackground,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "../../Components/CustomTextInput";
import { useForm, Controller } from "react-hook-form";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { sendOtp } from "../../services/authService";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [signupError, setSignupError] = useState("");
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

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [slideUpAnim]);

  const showErrorWithAnimation = (message: string) => {
    setSignupError(message);
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
      setSignupError("");
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

  const { setEmail } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();
      if (signupError) hideError();

      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        triggerShake();
        return;
      }
      // ✅ Store email in Zustand here — after validation
      setEmail(data.email);
      console.log("Sending OTP to:", data.email);

      const res = await sendOtp({ email: data.email });
      console.log("OTP response:", res);

      useAuthStore.getState().setOtpSession({
        sessionId: res.sessionId,
        email: data.email,
        type: res.type, // <-- add this
      });

      router.push("/(auth)/VerifyOtp");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setError("email", {
          type: "manual",
          message: "An account with this email already exists",
        });
        triggerShake();
      } else if (error?.response?.status === 422) {
        showErrorWithAnimation("Please check your information and try again.");
      } else if (error?.response?.status === 429) {
        showErrorWithAnimation("Too many signup attempts. Try again later.");
      } else if (error?.response?.status >= 500) {
        Alert.alert("Service Unavailable", "Try again later.");
      } else {
        showErrorWithAnimation("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/handsome-man.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.overlay}>
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
              <View style={styles.mainContent}>
                {/* Logo */}
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

                {/* Form */}
                <Animated.View
                  style={[
                    styles.formSection,
                    { transform: [{ translateY: slideUpAnim }] },
                  ]}
                >
                  <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Create Account</Text>
                    <Text style={styles.subtitleText}>
                      Join us and start your journey
                    </Text>
                  </View>

                  {/* Error */}
                  {signupError && (
                    <Animated.View
                      style={[styles.errorContainer, { opacity: fadeAnim }]}
                    >
                      <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{signupError}</Text>
                      </View>
                    </Animated.View>
                  )}

                  {/* Inputs */}
                  <Animated.View
                    style={[
                      styles.inputContainer,
                      { transform: [{ translateX: shakeAnim }] },
                    ]}
                  >
                    {/* Email Input */}
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      }}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <CustomTextInput
                          label="Email"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text);
                            if (signupError) hideError();
                            clearErrors("email");
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
                  </Animated.View>

                  {/* Sign Up Button */}
                  <TouchableOpacity
                    style={[
                      styles.signUpButton,
                      isSubmitting && styles.signUpButtonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.signUpButtonText}>
                      {isSubmitting ? "CREATING ACCOUNT..." : "SIGN UP"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/SignIn")}
                  >
                    <Text style={styles.footerLink}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  keyboardAvoid: {
    flex: 1,
  },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: "center",
  //   paddingVertical: 40,
  // },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  logoSection: {
    marginBottom: 48,
  },
  logoContainer: {
    width: 140,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 3,
  },
  formSection: {
    width: "100%",
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#bbb",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: "#1B0000",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#FF4D4D",
  },
  errorText: {
    fontSize: 14,
    color: "#FF4D4D",
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 32,
    gap: 16,
  },
  signUpButton: {
    height: 56,
    backgroundColor: "#000",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: "#333",
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#AAA",
    fontWeight: "400",
  },
  footerLink: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 6,
  },
});
