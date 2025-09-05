// Components/ServicesItem.tsx
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface ServiceItemProps {
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
  screen: string;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 64) / 2.2; // Responsive width

export default function ServicesItem({ 
  title, 
  icon, 
  color, 
  backgroundColor, 
  screen 
}: ServiceItemProps) {
  
  const handlePress = () => {
    // Navigate to the specified screen
    // router.push(screen);
    console.log(`Navigate to ${screen}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color === "#FFFFFF" ? "#333333" : "#FFFFFF" }]}>
          <Ionicons 
            name={icon as any} 
            size={24} 
            color={color === "#FFFFFF" ? "#FFFFFF" : "#000000"} 
          />
        </View>
        <Text style={[styles.title, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    marginHorizontal: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  content: {
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 120,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
});
