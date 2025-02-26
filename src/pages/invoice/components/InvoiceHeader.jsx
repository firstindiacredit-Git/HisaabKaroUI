import React from "react";

const InvoiceHeader = ({
  onDownloadPDF,
  colors,
  logo,
  invoiceData,
  onInvoiceDataChange,
}) => {
  return (
    <div className="mb-8 ">
      <div className="border-b border-gray-200 dark:border-gray-600 pb-4 p-4 rounded-t-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl text-gray-700 dark:text-white font-serif">
            INVOICE
          </h1>
          <div className="flex items-center gap-4">
            {logo?.dataUrl && (
              <img
                src={logo.dataUrl}
                alt="Company Logo"
                className="h-[100px] max-w-[200px] object-contain"
                style={{ opacity: logo.opacity }}
              />
            )}
            <button
              onClick={onDownloadPDF}
              className="inline-flex items-center px-4 py-2 border border-blue-500 dark:border-blue-400 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 text-sm font-medium rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceData.invoiceNumber}
              onChange={(e) =>
                onInvoiceDataChange({
                  ...invoiceData,
                  invoiceNumber: e.target.value,
                })
              }
              className="block w-full bg-gray-200 dark:bg-gray-700 p-1 pl-2 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="#INV-001"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              value={invoiceData.date}
              onChange={(e) =>
                onInvoiceDataChange({ ...invoiceData, date: e.target.value })
              }
              className="block w-full bg-gray-200 dark:bg-gray-700 p-1 pl-2 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) =>
                onInvoiceDataChange({ ...invoiceData, dueDate: e.target.value })
              }
              className="block w-full bg-gray-200 dark:bg-gray-700 p-1 pl-2 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
