import React from 'react';

const DeleteConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-200 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Confirmation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                      bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-red-500 dark:focus:ring-red-400 sm:text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 
                      bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 
                      dark:hover:bg-gray-600 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
