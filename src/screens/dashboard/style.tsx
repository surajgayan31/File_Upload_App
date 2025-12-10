import { StyleSheet } from "react-native";
import { color } from "../../styles/styles";

export const styles = StyleSheet.create({
 safeArea: {
    flex: 1,
    backgroundColor: color.buttonColor,
    marginVertical: -35,
    // paddingBottom:40,
  },

  header: {
    height: 55,
    backgroundColor: color.buttonColor,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

 

  screenTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1F2937",
  },

  card: {
    position: "absolute",
    bottom: 60,
    right: 30,
    backgroundColor: color.white,
    padding: 5,
    borderRadius: 12,
    elevation: 5,
    
  },

  uploadButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },

  message: {
    marginTop: 16,
    color: "#1F2937",
    fontSize: 15,
    textAlign: "center",
  }, 
});