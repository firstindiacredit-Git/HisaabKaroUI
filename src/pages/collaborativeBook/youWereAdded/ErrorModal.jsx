import React from 'react';

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark mode backdrop */}
      <div className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm"></div>
      
      <div className="relative bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-200 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                      bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
