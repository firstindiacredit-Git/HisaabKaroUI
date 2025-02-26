import React, { useState } from 'react';
import { normalizeFileUrl } from '../../../../utils/urlUtils';

const TransactionManagement = ({ transactionId, setTransaction, setErrorModal, setSuccessModal }) => {
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
  });
  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    description: "",
    transactionType: "",
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null });

  const handleAddTransaction = async () => {
    setAdding(true);
    const token = localStorage.getItem("token");
    const parsedAmount = parseFloat(newTransaction.amount);
  
    if (isNaN(parsedAmount)) {
      setErrorModal({
        isOpen: true,
        message: "Please enter a valid amount"
      });
      setAdding(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("amount", parsedAmount);
      formData.append("description", newTransaction.description);
      formData.append("transactionType", selectedTransactionType);
  
      if (newTransaction.file) {
        formData.append("file", newTransaction.file);
      }
  
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/create-transactions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      const result = await response.json();
  
      if (response.ok && result.transaction) {
        const newTransactionData = {
          ...result.transaction,
          initiatedBy: result.transaction.initiatedBy,
          file: result.transaction.file,
          confirmationStatus: "pending",
          transactionDate: new Date().toISOString(),
        };

        setTransaction(prevState => ({
          ...prevState,
          transactionHistory: [newTransactionData, ...(prevState?.transactionHistory || [])],
        }));

        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        
        if (updatedData.success) {
          setTransaction(prevState => ({
            ...updatedData.data,
            transactionHistory: updatedData.data.transactionHistory.map(entry => ({
              ...entry,
              initiatedBy: entry.initiatedBy,
              file: entry.file
            }))
          }));
        }

        setNewTransaction({ amount: "", description: "", file: null });
        setSelectedTransactionType("");
        setShowForm(false);

        setSuccessModal({
          isOpen: true,
          message: result.message || "Transaction added successfully!",
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to add transaction"
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: error.message || "An error occurred while adding the transaction.",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, transactionType, description, file } = editData;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("transactionType", transactionType.toLowerCase());
    formData.append("description", description);

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedEntry = await response.json();

        setTransaction((prev) => {
          const currentEntry = prev.transactionHistory.find(h => h._id === id);
          
          let fileUrl;
          if (updatedEntry?.data?.file) {
            fileUrl = normalizeFileUrl(updatedEntry.data.file);
          } else if (file instanceof File) {
            fileUrl = URL.createObjectURL(file);
          } else {
            fileUrl = currentEntry?.file ? normalizeFileUrl(currentEntry.file) : null;
          }

          return {
            ...prev,
            transactionHistory: prev.transactionHistory.map((entry) =>
              entry._id === id ? {
                ...entry,
                amount: parseFloat(amount),
                transactionType: transactionType.toLowerCase(),
                description: description,
                file: fileUrl,
                confirmationStatus: "pending",
                transactionDate: new Date().toISOString()
              } : entry
            ),
          };
        });

        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (!updatedDataResponse.ok) {
          throw new Error('Failed to fetch updated transaction data');
        }

        const updatedData = await updatedDataResponse.json();
        
        if (updatedData.success) {
          setTransaction((prev) => {
            const updatedHistory = prev.transactionHistory.map(entry => {
              const serverEntry = updatedData.data.transactionHistory.find(h => h._id === entry._id);
              if (serverEntry) {
                const normalizedFileUrl = serverEntry.file ? normalizeFileUrl(serverEntry.file) : null;
                return {
                  ...entry,
                  ...serverEntry,
                  file: normalizedFileUrl
                };
              }
              return entry;
            });

            return {
              ...prev,
              ...updatedData.data,
              transactionHistory: updatedHistory
            };
          });

          setSuccessModal({
            isOpen: true,
            message: "Transaction updated successfully!"
          });

          closeEditForm();
        }
      } else {
        const errorData = await response.json();
        setErrorModal({
          isOpen: true,
          message: errorData.message || "Failed to update the transaction. Please try again."
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      setErrorModal({
        isOpen: true,
        message: "An error occurred while updating the transaction."
      });
    }
  };

  const openEditForm = (entry) => {
    setEditData({
      id: entry._id,
      amount: entry.amount,
      description: entry.description || "",
      transactionType: entry.transactionType,
    });
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({
      id: null,
      amount: "",
      description: "",
      transactionType: "",
    });
  };

  const handleDeleteClick = (transaction) => {
    setDeleteModal({ isOpen: true, transaction });
  };

  const handleSplitSuccess = (updatedData) => {
    if (!updatedData) return;

    setTransaction(prevTransaction => {
      if (!prevTransaction?.transactionHistory) return prevTransaction;

      const updatedEntries = prevTransaction.transactionHistory.map(entry =>
        entry._id === updatedData.originalTransaction._id
          ? { ...entry, amount: updatedData.originalTransaction.amount }
          : entry
      );

      return {
        ...prevTransaction,
        transactionHistory: updatedEntries,
        outstandingBalance: prevTransaction.outstandingBalance
      };
    });

    setSuccessModal({
      isOpen: true,
      message: "Transaction split successfully!"
    });
  };

  return {
    adding,
    showForm,
    isEditing,
    selectedTransactionType,
    newTransaction,
    editData,
    deleteModal,
    setShowForm,
    setSelectedTransactionType,
    setNewTransaction,
    handleAddTransaction,
    handleEditSubmit,
    openEditForm,
    closeEditForm,
    handleDeleteClick,
    handleSplitSuccess,
    setDeleteModal
  };
};

export default TransactionManagement;
