import React from "react";
import { StyleSheet, View, Text } from "react-native";
import RecentDestinationItem from "./RecentDestinationItem";

const recentDestinations = [
  { 
    id: "1", 
    title: "Pink Berry Ice Cream", 
    subtitle: "Kwabenya • 12 min away",
    type: "recent"
  },
  { 
    id: "2", 
    title: "Starbites Restaurant", 
    subtitle: "East Legon • 8 min away",
    type: "recent"
  },
  { 
    id: "3", 
    title: "Accra Mall", 
    subtitle: "Tetteh Quarshie • 15 min away",
    type: "recent"
  },
  {
    id: "4",
    title: "Home",
    subtitle: "East Legon Hills • Set location",
    type: "saved"
  },
  {
    id: "5",
    title: "Work",
    subtitle: "Airport Residential • Set location",
    type: "saved"
  },
];

export default function RecentDestinationsList() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Recent destinations</Text>
      </View>
      <View style={styles.listContainer}>
        {recentDestinations.map((item) => (
          <RecentDestinationItem 
            key={item.id}
            title={item.title} 
            subtitle={item.subtitle}
            type={item.type as "recent" | "saved"}
          />
        ))}
        {recentDestinations.length === 0 && (
          <Text style={styles.emptyText}>No recent destinations.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    marginTop: 32,
    fontSize: 16,
    fontWeight: "400",
  },
});
