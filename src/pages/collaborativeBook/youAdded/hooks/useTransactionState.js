import { useState, useEffect } from 'react';

export const useTransactionState = (props = {}) => {
  const { onSplitSuccess } = props;
  
  // Initialize viewMode from localStorage or default to "grid"
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem('transactionViewMode');
    return savedViewMode || "grid";
  });

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transactionViewMode', viewMode);
  }, [viewMode]);

  const handleSplitClose = () => {
    setSelectedEntry(null);
    setShowSplitModal(false);
  };

  const handleSplitSuccess = (splitData) => {
    if (!splitData) return;

    handleSplitClose();
    if (onSplitSuccess) {
      onSplitSuccess(splitData);
    }
  };

  // Wrap setViewMode to persist the value
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('transactionViewMode', mode);
  };

  return {
    viewMode,
    showDescriptionModal,
    selectedDescription,
    selectedEntry,
    showSplitModal,
    setViewMode: handleViewModeChange,
    setShowDescriptionModal,
    setSelectedDescription,
    setSelectedEntry,
    setShowSplitModal,
    handleSplitClose,
    handleSplitSuccess,
  };
};
