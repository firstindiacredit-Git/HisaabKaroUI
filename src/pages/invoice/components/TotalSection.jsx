import React from 'react';

const TotalSection = ({
  invoiceData,
  onInvoiceDataChange,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal
}) => {
  const handleDiscountChange = (field, value) => {
    onInvoiceDataChange(prev => ({
      ...prev,
      discount: {
        ...prev.discount,
        [field]: value
      }
    }));
  };

  const handleTaxChange = (field, value) => {
    onInvoiceDataChange(prev => ({
      ...prev,
      tax: {
        ...prev.tax,
        [field]: value
      }
    }));
  };

  return (
    <div className="w-96 border border-transparent dark:bg-gray-800 dark:border-gray-800 rounded p-6 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-700 dark:text-white">
          <span>Subtotal:</span>
          <span className="font-medium text-gray-700 dark:text-white">{invoiceData.currency} {calculateSubtotal().toFixed(2)}</span>
        </div>

        {/* Discount Section */}
        <div className="py-3 border-b dark:border-gray-600 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="discountEnabled"
                checked={invoiceData.discount.enabled}
                onChange={(e) => handleDiscountChange('enabled', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="discountEnabled" className="text-gray-700 dark:text-white font-medium">
                Enable Discount
              </label>
            </div>
            {invoiceData.discount.enabled && (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={invoiceData.discount.rate}
                  onChange={(e) => handleDiscountChange('rate', e.target.value)}
                  className="w-16 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right appearance-none"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                />
                <span className="text-gray-600 dark:text-white font-medium">%</span>
              </div>
            )}
          </div>
          {invoiceData.discount.enabled && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-white font-medium">Discount ({invoiceData.discount.rate}%)</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {invoiceData.currency} {(calculateSubtotal() * invoiceData.discount.rate / 100).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Tax Section */}
        <div className="py-3 border-b dark:border-gray-600 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="taxEnabled"
                checked={invoiceData.tax.enabled}
                onChange={(e) => handleTaxChange('enabled', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="taxEnabled" className="text-gray-700 dark:text-white font-medium">
                Enable Tax
              </label>
            </div>
            {invoiceData.tax.enabled && (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={invoiceData.tax.rate}
                  onChange={(e) => handleTaxChange('rate', e.target.value)}
                  className="w-16 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right appearance-none"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                />
                <span className="text-gray-600 dark:text-white font-medium">%</span>
              </div>
            )}
          </div>
          {invoiceData.tax.enabled && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-white font-medium">Tax ({invoiceData.tax.rate}%)</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {invoiceData.currency} {calculateTaxAmount().toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="dark:text-white text-gray-700">{invoiceData.currency} {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSection;
