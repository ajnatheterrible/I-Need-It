export const handleImageUpload = async (
  file,
  index,
  setUploadedImageUrls,
  setUploadingIndex
) => {
  if (!file) return;

  setUploadingIndex(index);
  try {
    const url = await uploadImageToCloudinary(file);

    setUploadedImageUrls((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  } catch (err) {
    console.error(`❌ Upload failed for slot ${index + 1}:`, err);
  } finally {
    setUploadingIndex(null);
  }
};

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/market/upload-image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.url;
};
