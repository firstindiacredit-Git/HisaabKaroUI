import { useState, useEffect } from 'react';

export const useTransactionManagement = (transaction) => {
  const [sortConfig, setSortConfig] = useState({
    type: "date",
    order: "desc",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState({ id: "all", name: "All" });
  const [clientFilter, setClientFilter] = useState("all");
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (transaction?.transactionHistory) {
      const usersMap = new Map();
      const clientsMap = new Map();

      transaction.transactionHistory.forEach((history) => {
        if (history.initiatedBy) {
          usersMap.set(history.initiaterId, {
            id: history.initiaterId,
            name: history.initiatedBy,
          });
        }
        if (history.clientName) {
          clientsMap.set(history.clientId, {
            id: history.clientId,
            name: history.clientName,
          });
        }
      });

      setUniqueUsers(Array.from(usersMap.values()));
      setUniqueClients(Array.from(clientsMap.values()));
    }
  }, [transaction?.transactionHistory]);

  const filterAndSortTransactions = (transactions) => {
    if (!transactions) return [];

    let filteredTransactions = transactions.filter((history) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed"
          ? history.confirmationStatus === "confirmed"
          : statusFilter === "pending"
          ? history.confirmationStatus !== "confirmed"
          : true);

      const matchesUser =
        userFilter.id === "all" || history.initiaterId === userFilter.id;
      const matchesClient =
        clientFilter === "all" || history.clientId === clientFilter;

      return matchesStatus && matchesUser && matchesClient;
    });

    return [...filteredTransactions].sort((a, b) => {
      if (sortConfig.type === "date") {
        const dateA = new Date(a.transactionDate);
        const dateB = new Date(b.transactionDate);
        return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortConfig.order === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }
    });
  };

  const handleSortChange = (value) => {
    switch (value) {
      case "oldest":
        setSortConfig({ type: "date", order: "asc" });
        break;
      case "newest":
        setSortConfig({ type: "date", order: "desc" });
        break;
      case "amount_high":
        setSortConfig({ type: "amount", order: "desc" });
        break;
      case "amount_low":
        setSortConfig({ type: "amount", order: "asc" });
        break;
      default:
        setSortConfig({ type: "date", order: "desc" });
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleUserFilterChange = (value) => {
    const selectedUser = uniqueUsers.find((user) => user.id === value) || {
      id: "all",
      name: "All",
    };
    setUserFilter(selectedUser);
  };

  const handleClientFilterChange = (value) => {
    setClientFilter(value);
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setUserFilter({ id: "all", name: "All" });
    setClientFilter("all");
    setSortConfig({
      type: "date",
      order: "desc",
    });
  };

  return {
    sortConfig,
    statusFilter,
    userFilter,
    clientFilter,
    uniqueUsers,
    uniqueClients,
    viewMode,
    currentPage,
    pageSize,
    setViewMode,
    setCurrentPage,
    setPageSize,
    filterAndSortTransactions,
    handleSortChange,
    handleStatusFilterChange,
    handleUserFilterChange,
    handleClientFilterChange,
    clearAllFilters,
  };
};