// src/config/imageBase.js
export const API_BASE_URL = 'http://localhost:3000'; 
export const UPLOAD_BASE_URL = `${API_BASE_URL}/uploads/`;

export const buildImageUrl = (fileName) =>
  fileName ? `${UPLOAD_BASE_URL}${fileName}` : '';
