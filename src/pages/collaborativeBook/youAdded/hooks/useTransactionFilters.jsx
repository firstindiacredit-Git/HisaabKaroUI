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

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transaction?.transactionHistory) {
      console.log('No transaction history found');
      return [];
    }

    console.log('Filtering transactions:', transaction.transactionHistory.length);

    let filteredData = [...transaction.transactionHistory];

    if (statusFilter !== "all") {
      filteredData = filteredData.filter(
        (item) => item.confirmationStatus === statusFilter
      );
    }

    if (addedByFilter !== "all") {
      filteredData = filteredData.filter((item) => {
        if (addedByFilter === "user") {
          return item.initiatedBy === transaction?.userId?.name;
        } else {
          return item.initiatedBy === transaction?.clientUserId?.name;
        }
      });
    }

    switch (sortConfig.key) {
      case "transactionDate":
        filteredData.sort((a, b) => {
          const dateA = new Date(a.transactionDate).getTime();
          const dateB = new Date(b.transactionDate).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        });
        break;
      case "amount":
        filteredData.sort((a, b) => {
          const amountA = parseFloat(a.amount);
          const amountB = parseFloat(b.amount);
          return sortConfig.direction === "asc" ? amountA - amountB : amountB - amountA;
        });
        break;
      default:
        break;
    }

    return filteredData;
  }, [transaction?.transactionHistory, sortConfig, statusFilter, addedByFilter]);

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