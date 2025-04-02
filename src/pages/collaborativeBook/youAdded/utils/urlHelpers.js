const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:5100';

export const getFileUrl = (filePath) => {
  if (!filePath) return '';

  // Convert to string and normalize slashes
  const normalizedPath = String(filePath).replace(/\\/g, '/');

  // Remove any leading/trailing slashes and spaces
  const cleanPath = normalizedPath.trim().replace(/^\/+|\/+$/g, '');

  // Construct the final URL with the clean path
  return `${BASE_URL}/${cleanPath}`;
};