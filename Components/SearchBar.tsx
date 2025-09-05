import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  const handleNavigate = () => {
    router.push("/SearchScreen"); // change this if your route is different
  };

  return (
    <View style={styles.container}>
      {/* Touchable Search "Input" */}
      <TouchableOpacity
        style={styles.searchSection}
        activeOpacity={0.8}
        onPress={handleNavigate}
      >
        <View style={styles.inputContainer}>
          <View style={styles.iconRow}>
            <Ionicons
              name="search"
              size={18}
              color="#8E8E93"
              style={styles.searchIcon}
            />
          </View>

          <Text style={styles.placeholderText}>Where would you like</Text>

          <TouchableOpacity
            onPress={handleNavigate}
            style={styles.scheduleButton}
            activeOpacity={0.8}
          >
            <Ionicons name="time-outline" size={18} color="#000" />
            <Text style={styles.buttonText}>Later</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchSectionFocused: {
    borderColor: "#000",
    shadowOpacity: 0.12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    paddingVertical: 2,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    width: 32,
  },
  fromDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginRight: 8,
  },
  toDot: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: "#8E8E93",
    marginRight: 8,
  },
  searchIcon: {
    // Icon positioning handled by iconRow
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    paddingVertical: 4,
  },
  destinationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  destinationText: {
    flex: 1,
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "400",
  },
  scheduleButton: {
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },
});
