import React from 'react';
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineFileImage } from 'react-icons/ai';
import { BsFilePdf } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BiGitBranch } from 'react-icons/bi';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5100/uploads';

const GridView = ({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {paginatedTransactions.map((entry) => (
        <div
          key={entry._id}
          className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden ${
            entry.confirmationStatus === "pending"
              ? "border border-yellow-200"
              : entry.transactionType === "you will get"
              ? "border border-green-200"
              : "border border-red-200"
          }`}
        >
          {/* Grid item structure from original file */}
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
        </div>
      ))}
    </div>
  );
};

export default GridView; 