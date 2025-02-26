import { useState } from 'react';
import { normalizeFileUrl, handleFileUrl } from '../../../../utils/urlUtils';

export const useFilePreview = () => {
  const [filePreview, setFilePreview] = useState({
    visible: false,
    fileUrl: null,
    fileName: '',
    fileType: null
  });

  const handleFilePreview = (fileUrl, fileName, type) => {
    const normalizedUrl = normalizeFileUrl(fileUrl);
    setFilePreview({
      visible: true,
      fileUrl: normalizedUrl,
      fileName: fileName,
      fileType: type
    });
  };

  const closeFilePreview = () => {
    setFilePreview({
      visible: false,
      fileUrl: null,
      fileName: '',
      fileType: null
    });
  };

  const handleImageClick = (fileUrl) => {
    console.log("Opening file with URL:", fileUrl);
    if (!fileUrl) {
      console.error("No file URL provided");
      return;
    }

    try {
      const { url } = handleFileUrl(fileUrl);
      const fileName = url.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      if (fileExtension === 'pdf') {
        handleFilePreview(url, fileName, 'application/pdf');
      } else {
        handleFilePreview(url, fileName, 'image');
      }
    } catch (error) {
      console.error("Error processing file URL:", error);
      return {
        error: "Error opening file. Please try again."
      };
    }
  };

  return {
    filePreview,
    handleFilePreview,
    closeFilePreview,
    handleImageClick
  };
};
