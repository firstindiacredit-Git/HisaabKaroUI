import { useState, useMemo } from 'react';

export const useTransactionFilters = (transaction) => {
  const [sortConfig, setSortConfig] = useState({ key: "transactionDate", direction: "desc" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [addedByFilter, setAddedByFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showAddedByFilterMenu, setShowAddedByFilterMenu] = useState(false);
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transaction?.transactionHistory) return [];

    // Filter transactions
    let filtered = transaction.transactionHistory.filter((entry) => {
      const matchesStatus = statusFilter === "all" || entry.confirmationStatus === statusFilter;
      const matchesAddedBy = addedByFilter === "all" || entry.initiatedBy === addedByFilter;
      return matchesStatus && matchesAddedBy;
    });

    // Sort transactions
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "transactionDate") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortConfig.key === "amount") {
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [transaction, statusFilter, addedByFilter, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  const isFilterApplied = statusFilter !== "all" || addedByFilter !== "all";

  const clearAllFilters = () => {
    setStatusFilter("all");
    setAddedByFilter("all");
    setSortConfig({ key: "transactionDate", direction: "desc" });
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
