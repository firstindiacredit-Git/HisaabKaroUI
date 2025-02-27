import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export const ViewResponseModal = ({
  isOpen,
  onClose,
  response
}) => {
  if (!isOpen || !response) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">View Response</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            {response.responseMessage}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Response Date: {new Date(response.responseDate).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 