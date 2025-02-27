import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export const ResponseModal = ({
  isOpen,
  onClose,
  onSubmit,
  response,
  setResponse,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">Add Response</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
            className="w-full h-32 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !response.trim()}
            className={`px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 ${
              isSubmitting || !response.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}; 