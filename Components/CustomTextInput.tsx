// CustomTextInput.tsx

import { TextInput, StyleSheet, View, Text } from "react-native";
import React from "react";

interface CustomTextInputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  [key: string]: any; // For additional props like secureTextEntry, autoCapitalize, etc.
}

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  error,
  ...rest
}: CustomTextInputProps) => {
  return (
    <View style={styles.container}>
      {/* Input field */}
      <TextInput
        value={value || ""}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#999999"
        style={[styles.input, error ? styles.inputError : styles.inputNormal]}
        {...rest}
      />

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    // Subtle shadow for modern look
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputNormal: {
    borderColor: "#E0E0E0",
  },
  inputError: {
    borderColor: "#F44336",
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    marginTop: 8,
    marginLeft: 4,
    color: "#F44336",
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "500",
  },
});