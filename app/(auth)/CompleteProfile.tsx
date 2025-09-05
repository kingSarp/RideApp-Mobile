import React, { useState, useRef, useEffect } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import CustomTextInput from "../../Components/CustomTextInput";
import { router } from "expo-router";
import { completeProfile } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

type FormData = {
  name: string;
  password: string;
  phone: string;
  countryCode: string;
  email?: string;
};

const CompleteProfile = () => {
  const [signupError, setSignupError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      countryCode: "GH",
    },
  });

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

  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const { email } = useAuthStore();

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();
      if (signupError) hideError();

    

      // Use proper phone validation
      if (
        !data.phone ||
        !selectedCountry ||
        !isValidPhoneNumber(data.phone, selectedCountry)
      ) {
        setError("phone", {
          type: "manual",
          message: "Please enter a valid phone number",
        });
        triggerShake();
        return;
      }
      if (!email) {
  showErrorWithAnimation("Email is missing. Please log in again.");
  return;
}
       await completeProfile({
        email, // from store
        name: data.name,
        password: data.password,
        phone: data.phone,
        countryCode: data.countryCode,
      });

      console.log("Profile data:", data);
      router.replace("/(tabs)/Index");
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error?.response?.status === 409) {
        setError("email", {
          type: "manual",
          message: "An account with this email already exists",
        });
        triggerShake();
      } else if (error?.response?.status === 422) {
        showErrorWithAnimation("Please check your information and try again.");
      } else if (error?.response?.status === 429) {
        showErrorWithAnimation(
          "Too many signup attempts. Please try again later."
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
    <ImageBackground
      source={require("../../assets/images/afro1.png")}
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
                <View style={styles.formCard}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>
                      Complete Your Profile
                    </Text>
                    <Text style={styles.subtitleText}>
                      Just a few details to get you started
                    </Text>
                  </View>

                  {signupError && (
                    <Animated.View
                      style={[styles.errorContainer, { opacity: fadeAnim }]}
                    >
                      <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{signupError}</Text>
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
                      name="name"
                      rules={{
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      }}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <CustomTextInput
                          label="Full Name"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text);
                            if (signupError) hideError();
                            clearErrors("name");
                          }}
                          onBlur={onBlur}
                          error={errors.name?.message}
                          autoCapitalize="words"
                          autoComplete="name"
                        />
                      )}
                    />

                  

                    {/* Phone Input */}
                    <View style={styles.phoneInputContainer}>
                      {/* <Text style={styles.inputLabel}>Phone Number</Text> */}
                      <Controller
                        control={control}
                        name="phone"
                        rules={{ required: "Phone number is required" }}
                        render={({ field: { onChange, value } }) => (
                          <View style={styles.phoneInputWrapper}>
                            <PhoneInput
                              value={value}
                              selectedCountry={selectedCountry}
                              onChangePhoneNumber={(phone) => {
                                onChange(phone);
                                clearErrors("phone");
                                if (signupError) hideError();
                              }}
                              onChangeSelectedCountry={(country: ICountry) => {
                                setSelectedCountry(country);
                                setValue("countryCode", country?.cca2 || "");
                              }}
                              placeholder="Enter your phone number"
                              phoneInputStyles={{
                                container: styles.phoneContainer,
                                flagContainer: styles.flagContainer,
                                flag: styles.flag,
                                divider: styles.divider,
                                input: styles.phoneTextInput,
                              }}
                            />
                          </View>
                        )}
                      />
                      {errors.phone && (
                        <Text style={styles.errorText}>
                          {errors.phone.message}
                        </Text>
                      )}
                    </View>

                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      }}
                      render={({ field: { onChange, value, onBlur } }) => (
                        <CustomTextInput
                          label="Password"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text);
                            if (signupError) hideError();
                            clearErrors("password");
                          }}
                          onBlur={onBlur}
                          error={errors.password?.message}
                          secureTextEntry
                        />
                      )}
                    />

                    {/* Removed Confirm Password field as requested */}
                  </Animated.View>

                  {/* Enhanced Sign Up Button */}
                  <TouchableOpacity
                    style={[
                      styles.signUpButton,
                      isSubmitting && styles.signUpButtonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.signUpButtonText}>
                      {isSubmitting ? "CREATING PROFILE..." : "CREATE PROFILE"}
                    </Text>
                  </TouchableOpacity>

                  {/* Trust indicators */}
                  <View style={styles.trustSection}>
                    <Text style={styles.trustText}>
                      Secure • Private • Encrypted
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 130,
    height: 65,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2.5,
  },

  formSection: {
    flex: 1,
  },
  formCard: {
    // backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerContainer: {
    marginBottom: 28,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 27,
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
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 18,
  },
  phoneInputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    // marginLeft: 4,
  },
  phoneInputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  phoneContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 56,
  },
  flagContainer: {
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  flag: {
    fontSize: 22,
  },
  divider: {
    backgroundColor: "#E5E7EB",
  },
  phoneTextInput: {
    fontSize: 16,
    color: "#1F2937",
    paddingHorizontal: 14,
    flex: 1,
    fontWeight: "500",
  },
  signUpButton: {
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  trustSection: {
    alignItems: "center",
    paddingTop: 12,
  },
  trustText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
