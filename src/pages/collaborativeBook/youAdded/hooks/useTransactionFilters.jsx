import { useState, useMemo, useEffect } from 'react';

export const useTransactionFilters = (transaction) => {
  const [sortConfig, setSortConfig] = useState({
    key: "transactionDate",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [addedByFilter, setAddedByFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showAddedByFilterMenu, setShowAddedByFilterMenu] = useState(false);
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);

  console.log('useTransactionFilters - transaction:', transaction);
  console.log('useTransactionFilters - history:', transaction?.transactionHistory);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, addedByFilter, sortConfig]);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transaction?.transactionHistory) {
      console.log('No transaction history found');
      return [];
    }

    console.log('Filtering transactions:', transaction.transactionHistory.length);

    let filteredData = [...transaction.transactionHistory];

    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter((item) => {
        if (statusFilter === "confirmed") {
          return item.confirmationStatus === "confirmed";
        } else if (statusFilter === "pending") {
          return !item.confirmationStatus || item.confirmationStatus === "pending";
        }
        return true;
      });
    }

    // Apply added by filter
    if (addedByFilter !== "all") {
      filteredData = filteredData.filter((item) => {
        if (addedByFilter === "user") {
          return item.initiaterId === transaction?.userId?._id;
        } else if (addedByFilter === "client") {
          return item.initiaterId === transaction?.clientUserId?._id;
        }
        return true;
      });
    }

    // Apply sorting
    return filteredData.sort((a, b) => {
      switch (sortConfig.key) {
        case "transactionDate": {
          const dateA = new Date(a.transactionDate).getTime();
          const dateB = new Date(b.transactionDate).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        case "amount": {
          const amountA = parseFloat(a.amount) || 0;
          const amountB = parseFloat(b.amount) || 0;
          return sortConfig.direction === "asc" ? amountA - amountB : amountB - amountA;
        }
        default:
          return 0;
      }
    });
  }, [transaction, sortConfig, statusFilter, addedByFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  useEffect(() => {
    const isAnyFilterApplied = 
      statusFilter !== "all" || 
      addedByFilter !== "all" || 
      sortConfig.key !== "transactionDate" || 
      sortConfig.direction !== "desc";
    
    setIsFilterApplied(isAnyFilterApplied);
  }, [statusFilter, addedByFilter, sortConfig]);

  const clearAllFilters = () => {
    setSortConfig({ key: "transactionDate", direction: "desc" });
    setStatusFilter("all");
    setAddedByFilter("all");
    setCurrentPage(1);
  };

  return {
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
  };
}; 