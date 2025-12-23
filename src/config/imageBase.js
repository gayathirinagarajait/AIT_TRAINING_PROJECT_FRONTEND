export const buildImageUrl = (fileName) => {
  if (!fileName) return '';

  // Already absolute URL
  if (fileName.startsWith('http')) return fileName;

  // Backend base URL (IMPORTANT)
  const base = import.meta.env.VITE_IMG_BASE_URL;

  // Ensure no leading slash duplication
  const cleanName = fileName.replace(/^\/+/, '');

  return `${base}/uploads/products/${cleanName}`;
};
