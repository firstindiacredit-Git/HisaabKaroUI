import { useState, useEffect } from 'react';
import { normalizeFileUrl, handleFileUrl } from '../../../../utils/urlUtils';

export const useTransaction = (transactionId) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setTransaction(data.data);
      } else {
        console.error("Transaction not found");
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (entryId) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}/confirm`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === entryId
              ? { ...entry, confirmationStatus: "confirmed" }
              : entry
          ),
        }));

        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        if (updatedData.success) {
          setTransaction(prev => ({
            ...prev,
            outstandingBalance: updatedData.data.outstandingBalance
          }));
        }

        setSuccessModal({
          isOpen: true,
          message: "Transaction status updated successfully!"
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to update status. Please try again."
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: "An error occurred while updating the status."
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
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
  };
};
