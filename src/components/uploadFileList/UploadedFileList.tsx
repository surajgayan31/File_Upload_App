import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { UploadedFile } from "../../utils/uploadFileToSupabase";
import { Image } from "expo-image";

import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { color, fontSize } from "../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

// ✅ NEW

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type Props = {
  files: UploadedFile[];
  refreshing: boolean;
  onRefresh: () => void;
  loading?: boolean;
  onDelete?: (file: UploadedFile) => void; // ✅ new
};

export default function UploadedFileList({
  files,
  refreshing,
  onRefresh,
  loading,
  onDelete,
}: Props) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const renderRightActions = (item: UploadedFile) => (
    <View style={styles.deleteActionContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete && onDelete(item)}
      >
        <Ionicons name="trash" size={18} color="#FFFFFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: UploadedFile }) => {
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
      >
        <View style={styles.row}>
          {/* Thumbnail */}
          {item.isImage ? (
            <TouchableOpacity onPress={() => setPreviewImageUrl(item.url)}>
              <Image source={{ uri: item.url }} style={styles.thumb} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconWrapper}>
              <Image
                source={require("../../assetsImage/pdf.png")}
                style={{ width: 24, height: 24, tintColor: "#DC2626" }}
              />
            </View>
          )}

          {/* Name + actions */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            {!item.isImage && (
              <TouchableOpacity
                onPress={() => WebBrowser.openBrowserAsync(item.url)}
                style={styles.openBtn}
              >
                <Text style={styles.openBtnText}>View PDF</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Swipeable>
    );
  };

  const renderShimmerRow = (key: number) => (
    <View style={styles.row} key={key}>
      <ShimmerPlaceholder style={styles.thumb} />

      <View style={styles.info}>
        <ShimmerPlaceholder
          style={{ height: 14, borderRadius: 4, marginBottom: 8 }}
        />
        <ShimmerPlaceholder
          style={{ height: 24, width: 80, borderRadius: 4 }}
        />
      </View>
    </View>
  );

  if (loading && (!files || files.length === 0)) {
    return (
      <View style={styles.container}>
        {renderShimmerRow(1)}
        {renderShimmerRow(2)}
        {renderShimmerRow(3)}
        {renderShimmerRow(4)}
        {renderShimmerRow(5)}
        {renderShimmerRow(6)}
        {renderShimmerRow(7)}
        {renderShimmerRow(8)}
        {renderShimmerRow(9)}
        {renderShimmerRow(10)}
        {renderShimmerRow(11)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !refreshing ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 200,
              }}
            >
              <Text style={styles.emptyText}>No files uploaded yet.</Text>
            </View>
          ) : null
        }
      />

      {/* Full-screen image preview modal */}
      <Modal
        visible={!!previewImageUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImageUrl(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPreviewImageUrl(null)}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {previewImageUrl && (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.fullImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginHorizontal: 10,
    paddingBottom: 46,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
  openBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: color.buttonColor,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 80,
    alignItems: "center",
  },
  openBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: color.textRed,
  },
  emptyText: {
    fontSize: fontSize.size_20,
    color: color.grayText,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  deleteActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "90%",
    borderRadius: 8,
    marginRight: 4,
  },
  deleteText: {
    marginTop: 4,
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
