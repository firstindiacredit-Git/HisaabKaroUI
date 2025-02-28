import React from "react";
import { BsFilter, BsGrid, BsListUl, BsWhatsapp } from "react-icons/bs";
import { AiOutlineFilter } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export const FilterControls = ({
  viewMode,
  setViewMode,
  showSortMenu,
  setShowSortMenu,
  showStatusFilterMenu,
  setShowStatusFilterMenu,
  showAddedByFilterMenu,
  setShowAddedByFilterMenu,
  showItemsPerPage,
  setShowItemsPerPage,
  statusFilter,
  addedByFilter,
  itemsPerPage,
  handleSort,
  handleStatusFilter,
  handleAddedByFilter,
  handleItemsPerPageChange,
  handleSortChange,
  clearAllFilters,
  isFilterApplied,
  transaction,
  onWhatsAppReminder,
  userId,
}) => {
  const { t } = useTranslation();

  const handleSortOptionClick = (option) => {
    handleSortChange(option);
    setShowSortMenu(false);
  };

  const handleStatusOptionClick = (status) => {
    handleStatusFilter(status);
    setShowStatusFilterMenu(false);
  };

  const handleAddedByOptionClick = (filter) => {
    handleAddedByFilter(filter);
    setShowAddedByFilterMenu(false);
  };

  const handleItemsPerPageOptionClick = (value) => {
    handleItemsPerPageChange(value);
    setShowItemsPerPage(false);
  };

  // Get unique initiator names from transaction history
  const getInitiatorNames = () => {
    if (!transaction?.transactionHistory) return [];
    const uniqueInitiators = new Set();
    transaction.transactionHistory.forEach((entry) => {
      if (entry.initiatedBy) {
        uniqueInitiators.add(entry.initiatedBy);
      }
    });
    return Array.from(uniqueInitiators);
  };

  const initiatorNames = getInitiatorNames();

  // Move this outside the handler function
  const pendingTransactions = transaction?.transactionHistory?.filter(
    (entry) =>
      entry.confirmationStatus === "pending" && entry.initiaterId === userId
  );

  const handleSendReminders = async () => {
    // Send reminders one by one
    for (const entry of pendingTransactions) {
      await onWhatsAppReminder(entry);
    }
  };

  // Translate status filter display
  const getStatusDisplayText = (status) => {
    if (status === "all") return t("common.status");
    return t(`filters.${status}`);
  };

  // Translate added by filter display
  const getAddedByDisplayText = (filter) => {
    if (filter === "all") return t("common.addedBy");
    return filter;
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Filter controls wrapper */}
      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Top row - filters */}
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              <BsFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t("common.sort")}</span>
            </button>
            {showSortMenu && (
              <div className="absolute left-0 z-10 mt-2 w-48 bg-white dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 rounded-lg shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleSortOptionClick("newest")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.newestFirst")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("oldest")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.oldestFirst")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("amount_high")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.amountHighToLow")}
                  </button>
                  <button
                    onClick={() => handleSortOptionClick("amount_low")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700   hover:bg-gray-100"
                  >
                    {t("filters.amountLowToHigh")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status filter */}
          <div className="relative status-filter-dropdown shrink-0">
            <button
              onClick={() => setShowStatusFilterMenu(!showStatusFilterMenu)}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${
                statusFilter !== "all"
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-700 bg-white border dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400 border-gray-300"
              } rounded-lg hover:bg-gray-50 whitespace-nowrap`}
            >
              <AiOutlineFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{getStatusDisplayText(statusFilter)}</span>
            </button>
            {showStatusFilterMenu && (
              <div className="absolute left-0 z-10 mt-2 w-48 bg-white dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 rounded-lg shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusOptionClick("all")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.all")}
                  </button>
                  <button
                    onClick={() => handleStatusOptionClick("confirmed")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.confirmed")}
                  </button>
                  <button
                    onClick={() => handleStatusOptionClick("pending")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.pending")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Added by filter */}
          <div className="relative added-by-filter-dropdown shrink-0">
            <button
              onClick={() => setShowAddedByFilterMenu(!showAddedByFilterMenu)}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${
                addedByFilter !== "all"
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-700 bg-white border dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400 border-gray-300"
              } rounded-lg hover:bg-gray-50 whitespace-nowrap`}
            >
              <AiOutlineFilter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{getAddedByDisplayText(addedByFilter)}</span>
            </button>
            {showAddedByFilterMenu && (
              <div className="absolute left-0 z-10 mt-2 w-48 bg-white dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 rounded-lg shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleAddedByOptionClick("all")}
                    className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                  >
                    {t("filters.all")}
                  </button>
                  {initiatorNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleAddedByOptionClick(name)}
                      className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear filters button */}
          {isFilterApplied && (
            <button
              onClick={clearAllFilters}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 whitespace-nowrap shrink-0"
            >
              {t("common.clear")}
            </button>
          )}
        </div>

        {/* Bottom row - view options and items per page */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          {/* View mode toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 sm:p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-blue-100  text-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100"
              }`}
              title={t("viewMode.listView")}
            >
              <BsListUl className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 sm:p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-blue-100  text-blue-600"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100"
              }`}
              title={t("viewMode.gridView")}
            >
              <BsGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Items per page dropdown */}
          <div className="relative items-per-page-dropdown">
            <button
              onClick={() => setShowItemsPerPage(!showItemsPerPage)}
              className="flex items-center dark:text-gray-400 dark:bg-gray-700 dark:border-gray-700 justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span>
                {t("common.show")}: {itemsPerPage}
              </span>
            </button>
            {showItemsPerPage && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 rounded-lg shadow-lg border border-gray-200">
                <div className="py-1">
                  {[10, 20, 50, 100].map((number) => (
                    <button
                      key={number}
                      onClick={() => handleItemsPerPageOptionClick(number)}
                      className="block w-full px-4 py-2 text-sm text-left bg-white text-gray-700 dark:text-gray-400 dark:bg-gray-700  dark:border-gray-700 hover:bg-gray-100"
                    >
                      {number} {t("common.items")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add WhatsApp button before export button */}
          {pendingTransactions?.length > 0 && (
            <button
              onClick={handleSendReminders}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
              title={t("whatsapp.sendReminders")}
            >
              <BsWhatsapp className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">
                {t("whatsapp.sendReminders")}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
