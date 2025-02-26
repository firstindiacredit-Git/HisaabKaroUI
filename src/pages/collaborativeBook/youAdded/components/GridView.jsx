import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import {
  AiOutlineFileImage,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsFilePdf } from "react-icons/bs";
import { BiGitBranch } from "react-icons/bi";
import { formatDate, formatAmountWithoutPrefix } from '../utils/formatters';

export const GridView = ({
  paginatedTransactions,
  userId,
  updating,
  handleEditClick,
  handleDeleteClick,
  handleFileClick,
  handleSplitClick,
  updateTransactionStatus,
  setSelectedDescription,
  setShowDescriptionModal,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {paginatedTransactions.map((entry, index) => (
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
          {/* Status Notch */}
          <div
            className={`absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 ${
              entry.confirmationStatus === "pending"
                ? "bg-yellow-200"
                : entry.transactionType === "you will get"
                ? "bg-green-200"
                : "bg-red-200"
            }`}
          />

          {/* Index Number */}
          <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <span className="text-sm font-medium text-gray-600">
              {index + 1}
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-start space-x-3 mb-6 mt-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-medium text-gray-600">
                {entry.initiatedBy.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {entry.initiatedBy}
              </h3>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium ${
                  entry.transactionType === "you will get"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {entry.transactionType}
              </span>
              <div className="mt-2">
                <div className="relative">
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Description</h3>
                      {entry.file && (
                        <button
                          onClick={() => handleFileClick(entry)}
                          className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                            entry.file.toLowerCase().endsWith(".pdf")
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                          title={
                            entry.file.toLowerCase().endsWith(".pdf")
                              ? "View PDF"
                              : "View Image"
                          }
                        >
                          {entry.file.toLowerCase().endsWith(".pdf") ? (
                            <BsFilePdf className="w-5 h-5" />
                          ) : (
                            <AiOutlineFileImage className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                    {entry.description ? (
                      <>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {entry.description}
                        </p>
                        {entry.description.length > 100 && (
                          <button
                            onClick={() => {
                              setSelectedDescription(entry.description);
                              setShowDescriptionModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                          >
                            Read more
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">--</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <span
              className={`text-3xl font-bold ${
                entry.transactionType === "you will get"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatAmountWithoutPrefix(entry.amount)}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(entry.transactionDate)}
            </p>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              {entry.confirmationStatus === "confirmed" ? (
                <span className="flex items-center text-green-600">
                  <AiOutlineCheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm">Confirmed</span>
                </span>
              ) : (
                <span className="flex items-center text-yellow-600">
                  <AiOutlineClockCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm">Pending</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {entry.file && (
                <button
                  onClick={() => handleFileClick(entry)}
                  className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${
                    typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf")
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                  title={
                    typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf")
                      ? "View PDF"
                      : "View Image"
                  }
                >
                  {typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf") ? (
                    <BsFilePdf className="w-5 h-5" />
                  ) : (
                    <AiOutlineFileImage className="w-5 h-5" />
                  )}
                </button>
              )}

              {userId === entry.initiaterId ? (
                <>
                  <button
                    onClick={() => handleEditClick(entry)}
                    className="p-2 rounded-full hover:bg-gray-50 transition-colors text-yellow-500"
                    title="Edit"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(entry)}
                    className="p-2 rounded-full hover:bg-gray-50 transition-colors text-red-500"
                    title="Delete"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSplitClick(entry)}
                    className="p-2 rounded-full hover:bg-gray-50 transition-colors text-blue-500"
                    title="Split Transaction"
                  >
                    <BiGitBranch className="w-5 h-5" />
                  </button>
                </>
              ) : entry.confirmationStatus === "pending" ? (
                <button
                  onClick={() => updateTransactionStatus(entry._id)}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                >
                  {updating ? "Updating..." : "Confirm"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
