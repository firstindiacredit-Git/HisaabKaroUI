import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import TransactionHeader from "./TransactionHeader";
import AddTransactionForm from "./AddTransactionForm";
import TransactionTable from "./TransactionTable";
import EditTransactionForm from "./EditTransactionForm";
import FilePreviewModal from './components/modals/FilePreviewModal';
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import { useTransaction } from './hooks/useTransaction';
import { useFilePreview } from './hooks/useFilePreview';
import { useTransactionForms } from './hooks/useTransactionForms';
import { useTransactionDelete } from './hooks/useTransactionDelete';
import ActionButtons from './components/ActionButtons';
import { TableSkeleton } from './components/skeletons/TableSkeleton';
import { GridSkeleton } from './components/skeletons/GridSkeleton';

const History = () => {
  const { transactionId } = useParams();
  const transactionTableRef = useRef(null);
  const userId = localStorage.getItem("userId");
  
  const {
    transaction,
    loading,
    updating,
    errorModal,
    successModal,
    setErrorModal,
    setSuccessModal,
    setTransaction,
    updateTransactionStatus,
    fetchTransaction
  } = useTransaction(transactionId);

  const {
    filePreview,
    handleFilePreview,
    closeFilePreview,
    handleImageClick
  } = useFilePreview();

  const {
    showForm,
    isEditing,
    adding,
    selectedTransactionType,
    editData,
    newTransaction,
    setNewTransaction,
    setEditData,
    handleAddTransaction: addTransaction,
    handleEditSubmit: editSubmit,
    openEditForm,
    closeEditForm,
    initiateNewTransaction,
    setShowForm,
    setSelectedTransactionType,
    viewMode = 'list' // Add default view mode
  } = useTransactionForms(fetchTransaction);

  const {
    deleteModal,
    setDeleteModal,
    handleDelete,
    handleDeleteClick
  } = useTransactionDelete(fetchTransaction);

  const handleSplitSuccess = async () => {
    await fetchTransaction();
    setSuccessModal({
      isOpen: true,
      message: "Transaction split successfully!"
    });
  };

  if (loading) {
    return viewMode === 'grid' ? <GridSkeleton /> : <TableSkeleton />;
  }

  return (
    <div className="p-4 w-full mx-auto">
      <TransactionHeader transaction={transaction} />

      <ActionButtons 
        transaction={transaction}
        transactionTableRef={transactionTableRef}
        initiateNewTransaction={initiateNewTransaction}
      />

      <TransactionTable
        ref={transactionTableRef}
        transaction={transaction}
        userId={userId}
        updating={updating}
        updateTransactionStatus={updateTransactionStatus}
        handleDeleteClick={handleDeleteClick}
        handleImageClick={handleImageClick}
        handleAddTransaction={fetchTransaction}
        onSplitSuccess={handleSplitSuccess}
        openEditForm={openEditForm}
      />

      {showForm && (
        <AddTransactionForm
          showForm={showForm}
          selectedTransactionType={selectedTransactionType}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          handleAddTransaction={(e) => addTransaction(transaction, setErrorModal, setSuccessModal)}
          setShowForm={setShowForm}
          adding={adding}
          setSelectedTransactionType={setSelectedTransactionType}
        />
      )}

      <EditTransactionForm
        isEditing={isEditing}
        editData={editData}
        setEditData={setEditData}
        handleEditSubmit={(e) => editSubmit(e, transactionId, setErrorModal, setSuccessModal)}
        closeEditForm={closeEditForm}
      />

      <FilePreviewModal
        visible={filePreview.visible}
        onClose={closeFilePreview}
        fileUrl={filePreview.fileUrl}
        fileName={filePreview.fileName}
        fileType={filePreview.fileType}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
        onConfirm={() =>
          deleteModal.transaction && handleDelete(transactionId, deleteModal.transaction._id, setErrorModal, setSuccessModal)
        }
        transactionDetails={deleteModal.transaction}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
      />
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
      />
    </div>
  );
};

export default History;