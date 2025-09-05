import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecentDestinationItemProps {
  title: string;
  subtitle: string;
  type?: "recent" | "saved";
}

export default function RecentDestinationItem({ 
  title, 
  subtitle, 
  type = "recent" 
}: RecentDestinationItemProps) {
  const getIcon = () => {
    switch (type) {
      case "saved":
        return title === "Home" ? "home" : title === "Work" ? "business" : "bookmark";
      default:
        return "time-outline";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "saved":
        return "#000000";
      default:
        return "#8E8E93";
    }
  };

  const getIconBackgroundColor = () => {
    switch (type) {
      case "saved":
        return "#F0F0F0";
      default:
        return "#F6F6F6";
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        <Ionicons 
          name={getIcon() as any} 
          size={20} 
          color={getIconColor()} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
  },
});