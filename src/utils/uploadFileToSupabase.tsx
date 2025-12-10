// uploadToSupabase.ts

import { supabase } from "../services/supabaseClient";

 

const BUCKET_NAME = "uploads";

export type UploadedFile = {
  name: string;
  path: string;
  url: string;
  isImage: boolean;
};

export const listUploadedFiles = async (): Promise<UploadedFile[]> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error || !data) {
    console.error("Error listing files", error);
    throw error;
  }

  return data.map((file) => {
    const path = file.name; // root me store kar rahe ho
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

    const isImage = /\.(png|jpe?g)$/i.test(file.name);

    return {
      name: file.name,
      path,
      url: publicUrl,
      isImage,
    };
  });
};
