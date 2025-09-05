import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const AuthFooter = ({ question, actionText, onPress }: any) => {
  return (
    <View style={styles.footerContainer}>
      <Text>{question} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: "#007AFF", }}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
const styles = StyleSheet.create({
 
  buttonText: {
    // fontSize: 15,
    color: "007AFF",
    textAlign: "center",
  },
 

  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
      justifyContent: "center", 
    // marginTop: 20,
  },
});
