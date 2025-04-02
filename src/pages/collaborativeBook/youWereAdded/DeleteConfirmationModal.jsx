import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, transactionDetails }) => {
  if (!isOpen || !transactionDetails) return null;

  // Format transaction amount (without currency symbol)
  const formattedAmount = Math.abs(transactionDetails.amount).toLocaleString();

  const transactionType = transactionDetails.amount < 0 ? 'Expense' : 'Income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 dark:bg-gray-900/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg animate-fade-in">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-200 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Confirm Delete</h3>

          {/* Message */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this <strong>{transactionType}</strong> of <strong>{formattedAmount}</strong>?
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
