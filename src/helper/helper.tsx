const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const isValidFile = (file: any) => {
  if (!file) return { valid: false, error: "No file selected." };

  const { name, size } = file;

  // Extension check
  const ext = name?.split(".").pop()?.toLowerCase();
  const allowedExt = ["png", "jpg", "jpeg", "pdf"];

  if (!ext || !allowedExt.includes(ext)) {
    return {
      valid: false,
      error: "Only PNG/JPG/PDF under 5 MB allowed.",
    };
  }

  // Size check
  if (size && size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Only PNG/JPG/PDF under 5 MB allowed.",
    };
  }

  return { valid: true, error: null };
};
