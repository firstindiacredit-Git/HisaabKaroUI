import React from 'react';

const PDFViewerModal = ({ pdfUrl, isOpen, onClose }) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">PDF Viewer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 w-full h-full">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title="PDF Viewer"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;
