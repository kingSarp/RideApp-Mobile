// Components/FeaturedServiceCard.tsx
import { StyleSheet, Text, View, TouchableOpacity, Dimensions,ColorValue } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // If you want gradients


interface FeaturedServiceCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradientColors: [ColorValue, ColorValue, ...ColorValue[]];
  onPress: () => void;
}

const { width } = Dimensions.get('window');

export default function FeaturedServiceCard({ 
  title, 
  subtitle, 
  icon, 
  gradientColors,
  onPress 
}: FeaturedServiceCardProps) {
  return (
    <TouchableOpacity 
      style={styles.featuredContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredTextContainer}>
            <Text style={styles.featuredTitle}>{title}</Text>
            <Text style={styles.featuredSubtitle}>{subtitle}</Text>
          </View>
          <View style={styles.featuredIconContainer}>
            <Ionicons name={icon as any} size={32} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    width: width - 40,
    height: 140,
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    flex: 1,
  },
  featuredContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  featuredIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});

// Example usage for featured cards:
const featuredServices = [
  {
    id: "featured-1",
    title: "Go anywhere",
    subtitle: "Request a ride",
    icon: "car-sport",
    gradientColors: ["#000000", "#434343"],
  },
  {
    id: "featured-2", 
    title: "Send packages",
    subtitle: "On-demand delivery",
    icon: "cube",
    gradientColors: ["#1e3c72", "#2a5298"],
  },
];