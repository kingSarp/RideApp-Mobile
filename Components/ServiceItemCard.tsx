import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  Image
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface EnhancedServiceItemCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  color: string;
  backgroundColor: string;
  screen: string;
  badge?: string; // Optional badge like "NEW" or "POPULAR"
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 64) / 2.2;

export default function EnhancedServicesItemCard({ 
  title, 
  subtitle,
  imageUrl, 
  color, 
  backgroundColor, 
  screen,
  badge
}: EnhancedServiceItemCardProps) {
  
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    console.log(`Navigate to ${screen}`);
  };

  return (
    <TouchableOpacity 
      style={styles.enhancedCardContainer} 
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.enhancedImageContainer}>
        {!imageError ? (
          <Image 
            source={{ uri: imageUrl }}
            style={styles.enhancedCardImage}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.enhancedCardImage, { backgroundColor }]} />
        )}
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.enhancedCardContent}>
        <Text style={styles.enhancedCardTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.enhancedCardSubtitle}>{subtitle}</Text>
        )}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  enhancedCardContainer: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  enhancedImageContainer: {
    height: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  enhancedCardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  enhancedCardContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  enhancedCardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  enhancedCardSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "400",
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});

