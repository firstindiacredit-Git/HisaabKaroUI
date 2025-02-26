import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import FilePreviewModal from './modals/FilePreviewModal';
import { normalizeFileUrl, handleFileUrl } from '../../../../utils/urlUtils';

const FileHandling = ({ setErrorModal }) => {
  const [filePreview, setFilePreview] = useState({
    visible: false,
    fileUrl: null,
    fileName: '',
    fileType: null
  });

  const handleDownload = async () => {
    try {
      if (!filePreview.fileUrl) {
        throw new Error("No file to download");
      }

      const fileName = filePreview.fileName || filePreview.fileUrl.split("/").pop();
      const response = await fetch(filePreview.fileUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to download the file. Please try again."
      });
    }
  };

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
      setErrorModal({
        isOpen: true,
        message: "Error opening file. Please try again."
      });
    }
  };

  return {
    filePreview,
    handleDownload,
    handleImageClick,
    closeFilePreview,
    FilePreviewModalComponent: (
      <FilePreviewModal
        visible={filePreview.visible}
        onClose={closeFilePreview}
        fileUrl={filePreview.fileUrl}
        fileName={filePreview.fileName}
        fileType={filePreview.fileType}
      />
    )
  };
};

export default FileHandling;
