import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { color } from "../styles/styles";

export default function FilePickerButton({
  onSelect,
}: {
  onSelect: (file: any) => void;
}) {
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      onSelect({ error: "No file selected." });
      return;
    }

    const file = result.assets[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    // Type validation
    if (!allowedTypes.includes(file.mimeType!)) {
      onSelect({ error: "Only PNG/JPG/PDF allowed." });
      return;
    }

    // Size validation (max 5MB)
    if (file.size && file.size > 5 * 1024 * 1024) {
      onSelect({ error: "File must be under 5 MB." });
      return;
    }

    // Valid file
    onSelect({ file });
  };

  return (
    <Pressable onPress={pickFile} style={styles.button}>
      <Image
        source={require("../assetsImage/pick.png")}
        style={{ width: 50, height: 50, alignSelf: "center", tintColor: color.buttonColor }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // backgroundColor: color.buttonColor,
    padding: 12,
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
