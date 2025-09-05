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
  TextInput,
  Vibration,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { verifyOtp, sendOtp } from "../../services/authService";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyError, setVerifyError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpSession = useAuthStore((state) => state.otpSession);
  const inputRefs = useRef<TextInput[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [slideUpAnim, scaleAnim]);

  const showErrorWithAnimation = (message: string) => {
    setVerifyError(message);
    fadeAnim.setValue(0);
    Animated.spring(fadeAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Vibration.vibrate(300);
  };

  const hideError = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVerifyError("");
    });
  };

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOtpChange = (text: string, index: number) => {
    if (verifyError) hideError();

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every((digit) => digit !== "") && !isLoading) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");

    if (code.length !== 6) {
      showErrorWithAnimation("Please enter the complete 6-digit code");
      triggerShake();
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp({
        sessionId: otpSession?.sessionId || "",
        otp: code,
      });

console.log("✅ OTP Verification Response (used in condition):", response);


      // ✅ Store auth data
      useAuthStore.getState().setUser(response.user);
      useAuthStore.getState().setToken(response.token);
      useAuthStore.getState().clearOtpSession();


      // Navigate based on verification type
      if (response.isNewUser || response.needsProfile) {
        router.push("/(auth)/CompleteProfile");
      } else {
        router.replace("/(tabs)/Index");
      }
    } catch (error: any) {
      setIsLoading(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      if (error?.response?.status === 400) {
        showErrorWithAnimation("Invalid verification code");
        triggerShake();
      } else if (error?.response?.status === 429) {
        showErrorWithAnimation("Too many attempts. Try again later.");
      } else {
        showErrorWithAnimation("Verification failed. Please try again.");
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || !otpSession?.email) return;

    setCanResend(false);
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    try {
      await sendOtp({ email: otpSession.email });

      // Restart timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      showSuccessMessage("New code sent successfully");
    } catch (error) {
      setCanResend(true);
      setResendTimer(0);
      showErrorWithAnimation("Failed to resend code. Try again.");
    }
  };

  const showSuccessMessage = (message: string) => {
    Alert.alert("Success", message, [{ text: "OK", style: "default" }]);
  };

 const maskEmail = (email: string) => {
  if (!email || !email.includes("@")) return "";

  const [username, domain] = email.split("@");
  const visibleLength = Math.min(2, username.length);
  const maskedLength = Math.max(0, username.length - visibleLength);

  const maskedUsername = username.slice(0, visibleLength) + "*".repeat(maskedLength);

  return `${maskedUsername}@${domain}`;
};

  return (
    <ImageBackground
      source={require("../../assets/images/man-headphones.jpg")}
      // source={{
      //   uri: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?fit=crop&w=1080&q=80",
      // }}
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
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.backArrow}>←</Text>
                  </TouchableOpacity>
                </View>

                {/* Logo */}
                <Animated.View
                  style={[
                    styles.logoSection,
                    {
                      transform: [
                        { translateY: slideUpAnim },
                        { scale: scaleAnim },
                      ],
                    },
                  ]}
                >
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>RIDE</Text>
                  </View>
                </Animated.View>

                {/* Content */}
                <Animated.View
                  style={[
                    styles.contentSection,
                    { transform: [{ translateY: slideUpAnim }] },
                  ]}
                >
                  <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>
                      Enter Verification Code
                    </Text>
                    <Text style={styles.subtitleText}>
                      Please enter the 6-digit code we sent to{"\n"}
                      <Text style={styles.emailText}>
                        {maskEmail(otpSession?.email || "")}
                      </Text>
                    </Text>
                  </View>

                  {/* Error Message */}
                  {verifyError && (
                    <Animated.View
                      style={[styles.errorContainer, { opacity: fadeAnim }]}
                    >
                      <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{verifyError}</Text>
                      </View>
                    </Animated.View>
                  )}

                  {/* OTP Input */}
                  <Animated.View
                    style={[
                      styles.otpContainer,
                      { transform: [{ translateX: shakeAnim }] },
                    ]}
                  >
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) inputRefs.current[index] = ref;
                        }}
                        style={[
                          styles.otpInput,
                          digit && styles.otpInputFilled,
                          verifyError && styles.otpInputError,
                        ]}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={({ nativeEvent }) =>
                          handleKeyPress(nativeEvent.key, index)
                        }
                        keyboardType="numeric"
                        maxLength={1}
                        textAlign="center"
                        selectionColor="#FFF"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </Animated.View>

                  {/* Verify Button */}
                  <TouchableOpacity
                    style={[
                      styles.verifyButton,
                      (isLoading || otp.join("").length < 6) &&
                        styles.verifyButtonDisabled,
                    ]}
                    onPress={() => handleVerify()}
                    disabled={isLoading || otp.join("").length < 6}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.verifyButtonText}>
                      {isLoading ? "VERIFYING..." : "VERIFY CODE"}
                    </Text>
                  </TouchableOpacity>

                  {/* Resend Code */}
                  <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                      Didnt receive the code?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={handleResend}
                      disabled={!canResend}
                      style={styles.resendButton}
                    >
                      <Text
                        style={[
                          styles.resendLink,
                          !canResend && styles.resendLinkDisabled,
                        ]}
                      >
                        {canResend ? "Resend" : `Resend in ${resendTimer}s`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    flex: 1,
    // paddingHorizontal: 24,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  backArrow: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
  },
  logoSection: {
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 3,
  },
  contentSection: {
    width: "100%",
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 15,
    color: "#BBB",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    color: "#FFF",
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: "rgba(255,77,77,0.1)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#FF4D4D",
    backdropFilter: "blur(10px)",
  },
  errorText: {
    fontSize: 14,
    color: "#FF4D4D",
    fontWeight: "500",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    backdropFilter: "blur(10px)",
  },
  otpInputFilled: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "#FFF",
    transform: [{ scale: 1.02 }],
  },
  otpInputError: {
    borderColor: "#FF4D4D",
    backgroundColor: "rgba(255,77,77,0.1)",
  },
  verifyButton: {
    height: 56,
    backgroundColor: "#000",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: "#333",
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 1,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  resendText: {
    fontSize: 14,
    color: "#AAA",
    fontWeight: "400",
  },
  resendButton: {
    marginLeft: 4,
  },
  resendLink: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: "#666",
  },
});
