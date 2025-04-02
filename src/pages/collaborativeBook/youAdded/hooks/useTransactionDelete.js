import { useState } from 'react';

export const useTransactionDelete = (fetchTransaction) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null });

  const handleDelete = async (transactionId, entryId, setErrorModal, setSuccessModal) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        await fetchTransaction();
        setSuccessModal({
          isOpen: true,
          message: "Transaction deleted successfully",
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to delete transaction",
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: "An error occurred while deleting the transaction",
      });
    } finally {
      setDeleteModal({ isOpen: false, transaction: null });
    }
  };

  const handleDeleteClick = (transaction) => {
    setDeleteModal({ isOpen: true, transaction });
  };

  return {
    deleteModal,
    setDeleteModal,
    handleDelete,
    handleDeleteClick
  };
};
