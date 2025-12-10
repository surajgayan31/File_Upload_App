import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ SUPABASE ENV MISSING in uploadToSupabase.ts", {
    supabaseUrl,
    supabaseAnonKey,
  });
}

const BUCKET_NAME = "upload"; // 👈 exact bucket name from Supabase

export type UploadedFile = {
  name: string;
  path: string;
  url: string;
  isImage: boolean;
};

// ==================
// 📤 UPLOAD FILE
// ==================
export async function uploadFileToSupabase(file: any) {
  try {
    console.log("➡️ uploadFileToSupabase called with file:", {
      name: file.name,
      uri: file.uri,
      type: file.mimeType,
      size: file.size,
    });

    const filePath = `${Date.now()}-${file.name}`; // root of bucket

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any);

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${filePath}`;

    console.log("🌐 Uploading to URL:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("📥 Upload response status:", response.status);
    console.log("📦 Upload response body:", responseText);

    if (!response.ok) {
      return { error: responseText || "Upload failed" };
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;

    console.log("✅ Upload success. Public URL:", publicUrl);

    return { url: publicUrl };
  } catch (err) {
    console.log("💥 Exception while upload:", err);
    return { error: "Something went wrong" };
  }
}

// ==================
// 📃 LIST FILES
// ==================
export async function listUploadedFiles(): Promise<UploadedFile[]> {
  try {
    const listUrl = `${supabaseUrl}/storage/v1/object/list/${BUCKET_NAME}`;

    console.log("🌐 Listing from URL:", listUrl);

    const response = await fetch(listUrl, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: "", // ✅ root of bucket
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "desc" },
      }),
    });

    console.log("📥 List response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.log("❌ List failed, body:", text);
      throw new Error("Failed to list files");
    }

    const data: any[] = await response.json();
    console.log("📦 List data:", data);

    if (!data || data.length === 0) {
      console.log("ℹ️ No objects found in bucket:", BUCKET_NAME);
      return [];
    }

    return data.map((item) => {
      const path = item.name; // same as filePath used in upload

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`;

      const isImage = /\.(png|jpe?g)$/i.test(item.name);

      return {
        name: item.name,
        path,
        url: publicUrl,
        isImage,
      };
    });
  } catch (error) {
    console.log("💥 Exception while listing:", error);
    return [];
  }
}

// ==================
// 🗑 DELETE FILE
// ==================
// ==================
// 🗑 DELETE FILE
// ==================
export async function deleteFileFromSupabase(path: string) {
  try {
    const deleteUrl = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}`;

    console.log("🗑 Deleting from URL:", deleteUrl, "path:", path);

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefixes: [path], // 👈 yahan file ka path jaata hai
      }),
    });

    const text = await response.text();
    console.log("📥 Delete response status:", response.status);
    console.log("📦 Delete response body:", text);

    if (!response.ok) {
      throw new Error(text || "Failed to delete file");
    }

    console.log("✅ File deleted successfully:", path);
    return { success: true };
  } catch (error) {
    console.log("💥 Exception while deleting:", error);
    throw error;
  }
}

