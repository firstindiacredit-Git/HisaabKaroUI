import React from 'react';

const PDFViewer = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">PDF Viewer</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4">
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height="100%"
            className="border rounded"
          >
            <p>
              Unable to display PDF file. <a href={url} target="_blank" rel="noopener noreferrer">Download</a> instead.
            </p>
          </object>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 