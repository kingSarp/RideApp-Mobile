import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  ...rest 
}) => {
  const buttonStyle = [
    styles.baseButton,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.85}
      {...rest}
    >
      <Text style={textStyles}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  // Base styles
  baseButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Variant styles - Premium brand colors
  primaryButton: {
    backgroundColor: '#000000', // Deep black like Uber
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  
  primaryText: {
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: '#F8F9FA', // Clean white/light gray
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
  },
  
  secondaryText: {
    color: '#212529', // Dark gray text
  },

  successButton: {
    backgroundColor: '#00C851', // Bolt-inspired green
    borderWidth: 1,
    borderColor: '#00A444',
  },
  
  successText: {
    color: '#FFFFFF',
  },

  // Size variants
  smallButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 40,
  },
  
  smallText: {
    fontSize: 14,
  },

  mediumButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
    width: '88%',
    alignSelf: 'center',
  },
  
  mediumText: {
    fontSize: 16,
  },

  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    minHeight: 56,
    width: '92%',
    alignSelf: 'center',
  },
  
  largeText: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Disabled state
  disabledButton: {
    backgroundColor: '#E9ECEF',
    borderColor: '#DEE2E6',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  disabledText: {
    color: '#ADB5BD',
  },
});