import { normalizeFileUrl } from '../../../../utils/urlUtils';

export const handleFileView = (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Get normalized URL and add cache-busting parameter
    const normalizedUrl = normalizeFileUrl(fileUrl);
    const urlWithTimestamp = `${normalizedUrl}?t=${Date.now()}`;

    // For all files, open in new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      // Set the window location after opening to ensure proper handling
      newWindow.location.href = urlWithTimestamp;
    } else {
      // Fallback if popup is blocked
      console.warn('Popup was blocked. Creating direct link...');
      const link = document.createElement('a');
      link.href = urlWithTimestamp;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error opening file:', error);
    // Fallback to direct URL opening
    window.open(normalizeFileUrl(fileUrl), '_blank');
  }
};