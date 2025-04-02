import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <FaExclamationCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
