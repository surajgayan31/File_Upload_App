import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  Modal,
  TouchableOpacity,
  Image as RNImage,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FilePickerButton from "../../components/FilePickerButton";
import FilePreview from "../../components/FilePreview";
import CustomButton from "../../components/customButton/CustomButton";

import { styles } from "./style";
import { color, fontSize } from "../../styles/styles";
import { isValidFile } from "../../helper/helper";

import {
  uploadFileToSupabase,
  listUploadedFiles,
  type UploadedFile,
  deleteFileFromSupabase,
} from "../../utils/uploadToSupabase";

import UploadedFileList from "../../components/uploadFileList/UploadedFileList";

export default function DashBoard() {
  // Currently selected local file (from picker)
  const [file, setFile] = useState<any>(null);

  // UI message state
  const [message, setMessage] = useState("");

  // Upload loading state
  const [loading, setLoading] = useState(false);

  // Last uploaded file URL (from Supabase)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // All uploaded files fetched from Supabase
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // Modal visibility for selected file preview + upload
  const [showFileModal, setShowFileModal] = useState(false);

  /**
   * Fetch uploaded files list from Supabase
   */
  const fetchFiles = async () => {
    try {
      setListLoading(true);
      const data = await listUploadedFiles();
      setFiles(data);
    } catch (error) {
      console.log("Error fetching files:", error);
      ToastAndroid.show("Failed to load files", ToastAndroid.SHORT);
    } finally {
      setListLoading(false);
    }
  };

  /**
   * Initial load: get all uploaded files
   */
  useEffect(() => {
    fetchFiles();
  }, []);

  /**
   * Handle file selected from picker
   */
  const handleSelect = (result: any) => {
    if (result.error) {
      ToastAndroid.show(result.error, ToastAndroid.SHORT);
      setMessage(result.error);
      setFile(null);
      setUploadedUrl(null);
      setShowFileModal(false);
      return;
    }

    const selectedFile = result.file;

    const { valid, error } = isValidFile(selectedFile);

    if (!valid) {
      ToastAndroid.show(error || "Invalid file.", ToastAndroid.SHORT);
      setMessage(error || "Invalid file.");
      setFile(null);
      setUploadedUrl(null);
      setShowFileModal(false);
      return;
    }

    // Success case
    ToastAndroid.show("File selected successfully!", ToastAndroid.SHORT);
    setMessage("File selected: " + selectedFile.name);
    setFile(selectedFile);
    setUploadedUrl(null);

    // Open modal to preview + upload
    setShowFileModal(true);
  };

  /**
   * Upload currently selected file to Supabase
   */
  const handleUpload = async () => {
    if (!file) {
      const msg = "Please select a file first!";
      setMessage(msg);
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      setMessage("Uploading...");

      const result = await uploadFileToSupabase(file);

      if (result.error) {
        console.log("❌ Upload error (from function):", result.error);
        setMessage("Upload failed!");
        ToastAndroid.show("Upload failed!", ToastAndroid.SHORT);
      } else {
        setMessage("Uploaded successfully!");
        console.log("File URL:", result.url);
        setUploadedUrl(result.url);
        ToastAndroid.show("Uploaded successfully!", ToastAndroid.SHORT);

        // Refresh list after upload
        fetchFiles();

        // Close modal + clear selected file
        setShowFileModal(false);
        setFile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Close modal without uploading
   */
  const handleCancel = () => {
    setShowFileModal(false);
    // If you also want to clear file on cancel, uncomment:
    // setFile(null);
  };

  /**
   * Utility: detect mimeType & file kind (image/pdf/other)
   */
  const getFileKind = () => {
    if (!file) return { isImage: false, isPdf: false };

    const mimeType: string =
      file?.mimeType ||
      file?.type || // some pickers use "type"
      "";

    const isImage = mimeType.startsWith("image/");
    const isPdf =
      mimeType === "application/pdf" ||
      (typeof file.name === "string" &&
        file.name.toLowerCase().endsWith(".pdf"));

    return { isImage, isPdf };
  };

  const { isImage, isPdf } = getFileKind();

  const handleDeleteFile = async (fileToDelete: UploadedFile) => {
  // UI se pehle remove (optimistic)
  setFiles((prev) => prev.filter((f) => f.path !== fileToDelete.path));

  try {
    await deleteFileFromSupabase(fileToDelete.path);
    ToastAndroid.show("File deleted", ToastAndroid.SHORT);
  } catch (error) {
    ToastAndroid.show("Failed to delete file", ToastAndroid.SHORT);
    // Supabase fail ho gaya to list dobara fetch karke rollback
    fetchFiles();
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <View style={{ backgroundColor: color.white, borderRadius: 8,flex:1 }}>
        {/* All uploaded files list */}
        <UploadedFileList
          files={files}
          refreshing={listLoading}
          onRefresh={fetchFiles}
          loading={listLoading && files.length === 0} // ✅ yeh line add
        onDelete={handleDeleteFile}
        />

        {/* Last uploaded file preview (optional) */}
        {/* <View>
          <FilePreview url={uploadedUrl} />
        </View> */}

        {/* File picker card */}
      </View>
      <View style={styles.card}>
        <FilePickerButton onSelect={handleSelect} />
      </View>

      {/* MODAL: Selected file preview + Upload */}
      <Modal
        visible={showFileModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              padding: 16,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                Selected File
              </Text>
            </View>

            {/* File Info + Preview */}
            {file && (
              <>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", marginBottom: 12 }}
                  numberOfLines={2}
                >
                  {file.name}
                </Text>

                {/* IMAGE PREVIEW */}
                {isImage && (
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <RNImage
                      source={{ uri: file.uri }}
                      style={{ width: '100%', height: 200, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* PDF ICON PREVIEW */}
                {isPdf && (
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 16,
                      padding: 20,
                    }}
                  >
                    <RNImage
                      source={require("../../assetsImage/pdf.png")}
                      style={{ width: 80, height: 80, tintColor: "#DC2626" }}
                    />
                    <Text style={{ marginTop: 8, color: "#6B7280" }}>
                      PDF File Selected
                    </Text>
                  </View>
                )}

                {/* OTHER FILE TYPES */}
                {!isImage && !isPdf && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      marginBottom: 16,
                    }}
                  >
                    Preview not available for this file type. You can still
                    upload it.
                  </Text>
                )}
              </>
            )}

            {/* ACTION BUTTONS */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 8,
              }}
            >
              <CustomButton
                text="Cancel"
                onPress={handleCancel}
                height={45}
                textSize={fontSize.size_16}
                backgroundColor={color.textGray}
                textColor={color.white}
                width={"47%"}
              />

              <CustomButton
                text="Upload"
                width={"47%"}
                height={45}
                textSize={fontSize.size_16}
                backgroundColor={color.buttonColor}
                onPress={handleUpload}
                isLoading={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
