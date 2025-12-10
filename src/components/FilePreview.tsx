import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons"; // PDF icon

type Props = {
  url: string | null;
};

export default function FilePreview({ url }: Props) {
  if (!url) return null;

  const isImage = /\.(png|jpe?g)$/i.test(url);
  const fileName = url.split("/").pop(); // extract file name

  const handleOpenPdf = async () => {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url);
  };

  // ============================
  // 📸 IMAGE PREVIEW
  // ============================
  if (isImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
        {/* File Name */}
        <Text style={styles.fileName}>{fileName}</Text>
      </View>
    );
  }

  // ============================
  // 📄 PDF PREVIEW
  // ============================
  return (
    <View style={styles.container}>
      <Pressable onPress={handleOpenPdf} style={styles.pdfRow}>
        <Ionicons name="document-text-outline" size={28} color="#EF4444" />
        <Text style={styles.pdfName}>{fileName}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#56859aff",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    paddingVertical: 5,
    flexDirection:'row',
    gap:10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },

  // IMAGE
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: "cover",
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },

  // PDF ROW
  pdfRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pdfName: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
  },
});
