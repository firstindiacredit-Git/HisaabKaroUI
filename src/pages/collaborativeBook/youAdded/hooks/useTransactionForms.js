import { useState } from 'react';

export const useTransactionForms = (fetchTransaction) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    description: "",
    transactionType: "",
  });
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    file: null,
  });
  const [viewMode, setViewMode] = useState('list');

  const handleAddTransaction = async (transaction, setErrorModal, setSuccessModal) => {
    if (!transaction) return;
  
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
      formData.append("clientUserId", transaction.clientUserId._id);
      formData.append("bookId", transaction.bookId._id);
      formData.append("transactionType", selectedTransactionType);
      formData.append("amount", parsedAmount);
      formData.append("description", newTransaction.description);
      formData.append("transactionId", transaction._id);
  
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
        await fetchTransaction();
        resetNewTransaction();
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

  const handleEditSubmit = async (e, transactionId, setErrorModal, setSuccessModal) => {
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
        await fetchTransaction();
        setSuccessModal({
          isOpen: true,
          message: "Transaction updated successfully!"
        });
        closeEditForm();
      } else {
        const errorData = await response.json();
        setErrorModal({
          isOpen: true,
          message: errorData.message || "Failed to update the transaction. Please try again."
        });
      }
    } catch (error) {
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

  const resetNewTransaction = () => {
    setNewTransaction({ amount: "", description: "", file: null });
    setSelectedTransactionType("");
    setShowForm(false);
  };

  const initiateNewTransaction = (type) => {
    resetNewTransaction();
    setSelectedTransactionType(type);
    setShowForm(true);
  };

  return {
    showForm,
    isEditing,
    adding,
    selectedTransactionType,
    editData,
    newTransaction,
    setNewTransaction,
    setEditData,
    handleAddTransaction,
    handleEditSubmit,
    openEditForm,
    closeEditForm,
    initiateNewTransaction,
    setShowForm,
    setSelectedTransactionType,
    viewMode,
    setViewMode,
  };
};
