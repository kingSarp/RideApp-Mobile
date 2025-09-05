import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ServicesItemCard from "./ServiceItemCard";

const enhancedServices = [
  {
    id: "1",
    title: "Ride",
    subtitle: "Quick trips",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&crop=center",
    screen: "MapScreen",
    color: "#000000",
    backgroundColor: "#F0F0F0",
  },
  {
    id: "2",
    title: "Delivery",
    subtitle: "Send packages",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    screen: "DeliveryScreen",
    color: "#000000",
    backgroundColor: "#2196F3",
    badge: "NEW",
  },
  {
    id: "3",
    title: "Reserve",
    subtitle: "Book in advance",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
    screen: "ReserveScreen",
    color: "#FFFFFF",
    backgroundColor: "#1a1a1a",
    badge: "POPULAR",
  },
  {
    id: "4",
    title: "Intercity",
    subtitle: "Travel far",
    imageUrl:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop&crop=center",
    screen: "IntercityScreen",
    color: "#000000",
    backgroundColor: "#F0F0F0",
  },
  {
    id: "5",
    title: "Rental",
    subtitle: "Hourly cars",
    imageUrl:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop&crop=center",
    screen: "RentalScreen",
    color: "#FFFFFF",
    backgroundColor: "#2c2c2c",
  },
];


export default function ServicesList() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={enhancedServices}
        renderItem={({ item }) => (
    
          <ServicesItemCard
            title={item.title}
            imageUrl={item.imageUrl}
            color={item.color}
            backgroundColor={item.backgroundColor}
            screen={item.screen}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
