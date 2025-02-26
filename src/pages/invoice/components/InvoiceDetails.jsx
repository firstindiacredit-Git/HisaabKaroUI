import React from 'react';

const InvoiceDetails = ({ invoiceData, onInvoiceDataChange }) => {
  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoiceData.invoiceNumber}
            onChange={(e) => onInvoiceDataChange({ ...invoiceData, invoiceNumber: e.target.value })}
            className="block w-full border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="#INV-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e) => onInvoiceDataChange({ ...invoiceData, date: e.target.value })}
            className="block w-full border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => onInvoiceDataChange({ ...invoiceData, dueDate: e.target.value })}
            className="block w-full border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
