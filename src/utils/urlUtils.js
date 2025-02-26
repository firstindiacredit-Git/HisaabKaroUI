const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:5100';

/**
 * Cleans and normalizes a file URL to ensure consistent format
 * @param {string|object} fileInput - The file URL or object to clean
 * @returns {string} - The cleaned and normalized URL
 */
export const normalizeFileUrl = (fileInput) => {
  // Handle null/undefined
  if (!fileInput) return '';
  
  // If it's an object with a file property, use that
  const fileUrl = typeof fileInput === 'object' && fileInput.file 
    ? fileInput.file 
    : String(fileInput);

  // Convert to string if not already
  const urlString = String(fileUrl);
  
  // If it's a blob URL, return as is
  if (urlString.startsWith('blob:')) {
    return urlString;
  }

  try {
    // Remove any existing base URL or http:// prefixes
    let filepath = urlString
      .replace(new RegExp(`^(?:https?:)?//${BASE_URL.replace(/^https?:\/\//, '')}/?`, 'g'), '')
      .replace(/^https?:\/\//g, '');
    
    // Convert backslashes to forward slashes and trim
    filepath = filepath.replace(/\\/g, '/').trim();
    
    // Remove any query parameters
    filepath = filepath.split('?')[0];

    // Remove any leading/trailing slashes
    filepath = filepath.replace(/^\/+|\/+$/g, '');

    // Remove any duplicate 'uploads/transactions' paths
    const parts = filepath.split('/');
    const cleanParts = [];
    let skipNext = false;

    for (let i = 0; i < parts.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }
      
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      if (part === 'uploads' && nextPart === 'transactions') {
        if (cleanParts.length === 0) {
          cleanParts.push(part, nextPart);
        }
        skipNext = true;
      } else {
        cleanParts.push(part);
      }
    }

    filepath = cleanParts.join('/');

    // Construct the final URL
    return `${BASE_URL}/${filepath}`;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return String(fileUrl);
  }
};

/**
 * Handles opening a file URL in the appropriate way
 * @param {string|object} fileInput - The file URL or object to open
 * @returns {Object} - Object containing { url, shouldOpenInNewTab }
 */
export const handleFileUrl = (fileInput) => {
  const normalizedUrl = normalizeFileUrl(fileInput);
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(normalizedUrl);
  
  return {
    url: normalizedUrl,
    shouldOpenInNewTab: !isImage
  };
};
