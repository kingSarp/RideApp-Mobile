import React from "react";
import {
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../Components/SearchBar";
import RecentDestinationsList from "../../Components/RecentDestinationList";
import ServicesList from "../../Components/ServicesList";

export default function Index() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          {/* Fixed Header - stays at top */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.greetingText}>Good morning</Text>
              <Text style={styles.welcomeText}>Where to?</Text>
            </View>
            <View style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={32} color="#000" />
            </View>
          </View>

          {/* Fixed Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <ServicesList />
            <RecentDestinationsList />
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  profileContainer: {
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomSpacing: {
    height: 32, // Extra space at bottom
  },
});
