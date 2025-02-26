import React from 'react';
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineFileImage } from 'react-icons/ai';
import { BsFilePdf } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BiGitBranch } from 'react-icons/bi';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5100/uploads';

const TableView = ({
  paginatedTransactions,
  handleImageClick,
  handleEditClick,
  handleDeleteClick,
  handleSplitClick,
  userId,
  formatDate,
  formatAmountWithoutPrefix,
  setSelectedDescription,
  setShowDescriptionModal,
  transaction,
  updateTransactionStatus,
  updating
}) => {
  const getFileUrl = (filePath) => {
    if (!filePath) return '';
    // Replace backslashes with forward slashes
    const normalizedPath = filePath.replace(/\\/g, '/');
    // Remove any leading 'uploads/' if it exists
    const cleanPath = normalizedPath.replace(/^uploads\//, '');
    return `${UPLOADS_URL}/${cleanPath}`;
  };

  return (
    <>
      {/* Desktop View - Original Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiated By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((entry, index) => (
              <tr key={entry._id} className={`hover:bg-gray-50`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.transactionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.initiatedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entry.transactionType === "you will get" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {entry.transactionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={entry.transactionType === "you will get" ? "text-green-600" : "text-red-600"}>
                    {formatAmountWithoutPrefix(entry.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {entry.description || "No description"}
                    {entry.description && entry.description.length > 50 && (
                      <button
                        onClick={() => {
                          setSelectedDescription(entry.description);
                          setShowDescriptionModal(true);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.confirmationStatus === "confirmed" ? (
                    <span className="flex items-center text-green-600">
                      <AiOutlineCheckCircle className="mr-1" />
                      <span className="text-sm">Confirmed</span>
                    </span>
                  ) : (
                    userId === entry.initiaterId ? (
                      <span className="flex items-center text-yellow-600">
                        <AiOutlineClockCircle className="mr-1" />
                        <span className="text-sm">Pending</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => updateTransactionStatus(entry._id)}
                        disabled={updating}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        {updating ? "Updating..." : "Confirm"}
                      </button>
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.file && (
                    <button
                      onClick={() => handleImageClick(getFileUrl(entry.file))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {typeof entry.file === 'string' && entry.file.toLowerCase().endsWith('.pdf') ? (
                        <BsFilePdf className="text-xl" />
                      ) : (
                        <AiOutlineFileImage className="text-xl" />
                      )}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {userId === entry.initiaterId && (
                      <>
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(entry)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleSplitClick(entry)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <BiGitBranch className="text-xl" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="sm:hidden space-y-2">
        {paginatedTransactions.map((entry) => (
          <div 
            key={entry._id}
            className={`bg-white rounded-lg shadow-sm p-3 ${
              entry.transactionType === "you will give" 
                ? "border-l-4 border-red-500" 
                : "border-l-4 border-green-500"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-lg font-semibold ${
                  entry.transactionType === "you will get" ? "text-green-600" : "text-red-600"
                }`}>
                    {formatAmountWithoutPrefix(entry.amount)}
                </span>
                <div className="text-sm text-gray-500">{formatDate(entry.transactionDate)}</div>
              </div>
              <div className="flex items-center space-x-2">
                {entry.file && (
                  <button
                    onClick={() => handleImageClick(getFileUrl(entry.file))}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    {typeof entry.file === 'string' && entry.file.toLowerCase().endsWith('.pdf') ? (
                      <BsFilePdf className="text-red-500" />
                    ) : (
                      <AiOutlineFileImage className="text-blue-500" />
                    )}
                  </button>
                )}
                {userId === entry.initiaterId && (
                  <>
                    <button
                      onClick={() => handleEditClick(entry)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MdEdit className="text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(entry)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MdDelete className="text-red-500" />
                    </button>
                    <button
                      onClick={() => handleSplitClick(entry)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <BiGitBranch className="text-blue-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {entry.description || "No description"}
              {entry.description && entry.description.length > 100 && (
                <button
                  onClick={() => {
                    setSelectedDescription(entry.description);
                    setShowDescriptionModal(true);
                  }}
                  className="ml-1 text-blue-600"
                >
                  Read more
                </button>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">By: {entry.initiatedBy}</span>
              {entry.confirmationStatus === "confirmed" ? (
                <span className="flex items-center text-green-600">
                  <AiOutlineCheckCircle className="mr-1" />
                  Confirmed
                </span>
              ) : (
                userId !== entry.initiaterId && (
                  <button
                    onClick={() => updateTransactionStatus(entry._id)}
                    disabled={updating}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Confirm"}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TableView; 