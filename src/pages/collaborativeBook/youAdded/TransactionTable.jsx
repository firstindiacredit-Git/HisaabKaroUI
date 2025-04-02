import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useParams } from "react-router-dom";
import { Image } from 'antd';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionHandlers } from './hooks/useTransactionHandlers';
import { GridView } from './components/GridView';
import { TableView } from './components/TableView';
import { FilterControls } from './components/FilterControls';
import { DescriptionModal } from './components/modals/DescriptionModal';
import SplitTransaction from './splitTransaction';
import { useTransactionState } from './hooks/useTransactionState';
import PDFViewerModal from './components/modals/PDFViewerModal';
import { formatAmountWithoutPrefix, formatDate } from './utils/formatters';

const TransactionTable = forwardRef(
  (
    {
      transaction,
      userId,
      updating,
      updateTransactionStatus,
      openEditForm,
      handleDeleteClick,
      handleImageClick,
      handleAddTransaction,
      onSplitSuccess,
    },
    ref
  ) => {
    const { transactionId } = useParams();
    
    const {
      viewMode,
      showDescriptionModal,
      selectedDescription,
      selectedEntry,
      showSplitModal,
      setShowDescriptionModal,
      setSelectedDescription,
      setSelectedEntry,
      setShowSplitModal,
      handleSplitClose,
      handleSplitSuccess,
      setViewMode
    } = useTransactionState({ onSplitSuccess });

    const [selectedFile, setSelectedFile] = useState(null);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const {
      sortConfig,
      setSortConfig,
      statusFilter,
      setStatusFilter,
      addedByFilter,
      setAddedByFilter,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      isFilterApplied,
      filteredAndSortedTransactions,
      paginatedTransactions,
      clearAllFilters,
      showSortMenu,
      setShowSortMenu,
      showStatusFilterMenu,
      setShowStatusFilterMenu,
      showAddedByFilterMenu,
      setShowAddedByFilterMenu,
      showItemsPerPage,
      setShowItemsPerPage
    } = useTransactionFilters(transaction);

    const {
      handleSort,
      handleStatusFilter,
      handleAddedByFilter,
      handleItemsPerPageChange,
      handleSortChange,
      handleEditClick,
      handleFileClick,
      handleSplitClick,
      exportToPDF,
    } = useTransactionHandlers({
      transaction,
      userId,
      sortConfig,
      setSortConfig,
      statusFilter,
      setStatusFilter,
      addedByFilter,
      setAddedByFilter,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      setSelectedEntry,
      setShowSplitModal,
      openEditForm,
      setSelectedFile,
      setShowPDFModal,
      setShowImagePreview,
      setPreviewImage,
    });

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }));

    if (!transaction?.transactionHistory) {
      return null;
    }

    const handleWhatsAppReminder = async (entry) => {
      console.log('Entry data:', entry);
      const phoneNumber = transaction?.clientUserId?.mobile;
      
      if (!phoneNumber) {
        console.log('No phone number found');
        return;
      }

      try {
        // Generate PDF without downloading
        const pdfBlob = await exportToPDF(false); // Pass false to prevent auto-download
        
        // Create a FormData object to upload the PDF
        const formData = new FormData();
        formData.append('file', pdfBlob, 'transaction_history.pdf');
        
        // Upload the PDF to your server
        const uploadResponse = await fetch(`${process.env.REACT_APP_URL}/api/upload-pdf`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        const { success, fileUrl } = await uploadResponse.json();

        if (!success) {
          throw new Error('Failed to upload PDF');
        }

        // Create WhatsApp message with PDF link and credits
        const message = encodeURIComponent(
          `Reminder: You have a pending transaction of ${formatAmountWithoutPrefix(entry.amount)} from ${formatDate(entry.transactionDate)}. Please confirm the transaction.` +
          `\n\nYou can view your complete transaction history here: ${process.env.REACT_APP_URL}${fileUrl}` +
          `\n\nRegards,\n${transaction?.userId?.name || 'User'}` +
          `\n\n--\nPowered by HisaabKaro.com\nYour Digital Expense Management Partner`
        );
        
        const formattedPhone = phoneNumber.replace(/^\+91/, '');
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=91${formattedPhone}&text=${message}&type=phone_number&app_absent=0`;
        window.open(whatsappUrl, '_blank');

      } catch (error) {
        console.error('Error sending reminder with PDF:', error);
        // Send message without PDF if there's an error
        const message = encodeURIComponent(
          `Reminder: You have a pending transaction of ${formatAmountWithoutPrefix(entry.amount)} from ${formatDate(entry.transactionDate)}. Please confirm the transaction.` +
          `\n\nRegards,\n${transaction?.userId?.name || 'User'}` +
          `\n\n--\nPowered by HisaabKaro.com\nYour Digital Expense Management Partner`
        );
        
        const formattedPhone = phoneNumber.replace(/^\+91/, '');
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=91${formattedPhone}&text=${message}&type=phone_number&app_absent=0`;
        window.open(whatsappUrl, '_blank');
      }
    };

    const enrichedTransactions = transaction?.transactionHistory?.map(entry => ({
      ...entry,
      clientUserNumber: transaction?.clientUserId?.mobile,
      clientName: transaction?.clientUserId?.name
    }));

    return (
      <div className="mt-4">
        <FilterControls 
          viewMode={viewMode}
          setViewMode={setViewMode}
          showSortMenu={showSortMenu}
          setShowSortMenu={setShowSortMenu}
          showStatusFilterMenu={showStatusFilterMenu}
          setShowStatusFilterMenu={setShowStatusFilterMenu}
          showAddedByFilterMenu={showAddedByFilterMenu}
          setShowAddedByFilterMenu={setShowAddedByFilterMenu}
          showItemsPerPage={showItemsPerPage}
          setShowItemsPerPage={setShowItemsPerPage}
          statusFilter={statusFilter}
          addedByFilter={addedByFilter}
          itemsPerPage={itemsPerPage}
          handleSort={handleSort}
          handleStatusFilter={handleStatusFilter}
          handleAddedByFilter={handleAddedByFilter}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handleSortChange={handleSortChange}
          clearAllFilters={clearAllFilters}
          isFilterApplied={isFilterApplied}
          transaction={{
            ...transaction,
            transactionHistory: enrichedTransactions
          }}
          onWhatsAppReminder={handleWhatsAppReminder}
          userId={userId}
        />

        {paginatedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 dark:bg-gray-800 bg-white rounded-lg shadow-sm mt-4">
            <div className="text-gray-500 text-lg font-medium mb-2">No results found</div>
            <p className="text-gray-400 text-sm">Try adjusting your filters or clear them to see more results.</p>
            {isFilterApplied && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <GridView
            paginatedTransactions={paginatedTransactions}
            userId={userId}
            updating={updating}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleFileClick={handleFileClick}
            handleSplitClick={handleSplitClick}
            updateTransactionStatus={updateTransactionStatus}
            setSelectedDescription={setSelectedDescription}
            setShowDescriptionModal={setShowDescriptionModal}
          />
        ) : (
          <TableView 
            paginatedTransactions={paginatedTransactions}
            userId={userId}
            updating={updating}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleFileClick={handleFileClick}
            handleSplitClick={handleSplitClick}
            updateTransactionStatus={updateTransactionStatus}
            setSelectedDescription={setSelectedDescription}
            setShowDescriptionModal={setShowDescriptionModal}
            onWhatsAppReminder={handleWhatsAppReminder}
            transaction={transaction}
          />
        )}

        {showDescriptionModal && (
          <DescriptionModal
            description={selectedDescription}
            onClose={() => setShowDescriptionModal(false)}
          />
        )}

        {showSplitModal && selectedEntry && (
          <SplitTransaction
            onClose={handleSplitClose}
            originalTransaction={selectedEntry}
            bookId={selectedEntry.bookId}
            onSuccess={handleSplitSuccess}
          />
        )}

        {/* Image Preview */}
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: showImagePreview,
            src: previewImage,
            onVisibleChange: (visible) => {
              setShowImagePreview(visible);
              if (!visible) {
                setPreviewImage(null);
              }
            },
          }}
        />

        {/* PDF Modal */}
        {showPDFModal && selectedFile && (
          <PDFViewerModal
            pdfUrl={selectedFile}
            isOpen={showPDFModal}
            onClose={() => {
              setShowPDFModal(false);
              setSelectedFile(null);
            }}
          />
        )}
      </div>
    );
  }
);

export default TransactionTable;