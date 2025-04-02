import React, { useState } from 'react';

export const SplitTransactionModal = ({ transaction, onClose, onSuccess }) => {
  // Add null check and default value for transaction
  const initialAmount = transaction?.amount || 0;

  const [splits, setSplits] = useState([
    { amount: initialAmount, description: '' }
  ]);

  const handleSplitSubmit = () => {
    const totalAmount = splits.reduce((sum, split) => sum + Number(split.amount), 0);
    if (Math.abs(totalAmount - initialAmount) > 0.01) {
      alert('Split amounts must equal the total transaction amount');
      return;
    }
    onSuccess(splits);
  };

  const addSplit = () => {
    setSplits([...splits, { amount: 0, description: '' }]);
  };

  const removeSplit = (index) => {
    if (splits.length > 1) {
      setSplits(splits.filter((_, i) => i !== index));
    }
  };

  const updateSplit = (index, field, value) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
  };

  // If no transaction is provided, don't render the modal
  if (!transaction) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Split Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Total Amount: <span className="font-medium">{initialAmount}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Transaction Type: <span className="font-medium">{transaction.transactionType}</span>
          </p>
        </div>

        <div className="space-y-4">
          {splits.map((split, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="number"
                  value={split.amount}
                  onChange={(e) => updateSplit(index, 'amount', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Amount"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={split.description}
                  onChange={(e) => updateSplit(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Description"
                />
              </div>
              <button
                onClick={() => removeSplit(index)}
                className="text-red-500 hover:text-red-600"
                disabled={splits.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={addSplit}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Add Split
          </button>
          <button
            onClick={handleSplitSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
