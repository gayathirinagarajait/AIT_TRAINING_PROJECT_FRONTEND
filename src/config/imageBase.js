// In your ../../config/imageBase.js file:
export const buildImageUrl = (fileName) => {
  if (!fileName) {
    console.warn('buildImageUrl: No filename provided');
    return null;
  }

  // Clean the filename
  const cleanFileName = fileName.trim();
  if (!cleanFileName) {
    console.warn('buildImageUrl: Empty filename after trimming');
    return null;
  }

  const base = import.meta.env.VITE_API_URL;
  
  if (!base) {
    console.error('buildImageUrl: VITE_API_URL is not defined in environment');
    return null;
  }

  // If already absolute, return as is
  if (cleanFileName.startsWith('http')) {
    console.log('buildImageUrl: Already absolute URL:', cleanFileName);
    return cleanFileName;
  }

  // Remove any leading slashes to ensure proper concatenation
  const path = cleanFileName.replace(/^\/+/, '');
  const url = `${base}/uploads/${path}`;
  
  console.log('buildImageUrl: Built URL:', url);
  return url;
};