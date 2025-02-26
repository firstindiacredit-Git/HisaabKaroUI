import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import {
  AiOutlineFileImage,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BsFilePdf } from "react-icons/bs";
import { BiGitBranch } from "react-icons/bi";
import { formatDate, formatAmountWithoutPrefix } from '../utils/formatters';

export const TableView = ({
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
    <div>
      {/* Desktop View (unchanged) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Initiated By
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((entry, index) => (
              <tr key={entry._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.transactionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.initiatedBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.transactionType === "you will get"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.transactionType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={
                      entry.transactionType === "you will get"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {formatAmountWithoutPrefix(entry.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.description ? (
                    <button
                      onClick={() => {
                        setSelectedDescription(entry.description);
                        setShowDescriptionModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.file && (
                    <button
                      onClick={() => handleFileClick({ ...entry })}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {entry.file.toLowerCase().endsWith('.pdf') ? (
                        <BsFilePdf className="w-5 h-5" />
                      ) : (
                        <AiOutlineFileImage className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center ${
                      entry.confirmationStatus === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {entry.confirmationStatus === "confirmed" ? (
                      <>
                        <AiOutlineCheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Confirmed</span>
                      </>
                    ) : (
                      <>
                        <AiOutlineClockCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Pending</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {userId === entry.initiaterId ? (
                      <>
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-yellow-500"
                          title="Edit"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(entry)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-red-500"
                          title="Delete"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSplitClick(entry)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-blue-500"
                          title="Split Transaction"
                        >
                          <BiGitBranch className="w-4 h-4" />
                        </button>
                      </>
                    ) : entry.confirmationStatus === "pending" ? (
                      <button
                        onClick={() => updateTransactionStatus(entry._id)}
                        disabled={updating}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {updating ? "Updating..." : "Confirm"}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table View */}
      <div className="md:hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="grid grid-cols-12 gap-1 px-2 py-2">
              <th className="col-span-1 text-left text-xs font-medium text-gray-500">#</th>
              <th className="col-span-7 text-left text-xs font-medium text-gray-500">Details</th>
              <th className="col-span-4 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((entry, index) => (
              <tr key={entry._id} className="grid grid-cols-12 gap-1 px-2 py-2">
                {/* Index Column */}
                <td className="col-span-1 text-xs text-gray-400 flex items-center">
                  {index + 1}
                </td>

                {/* Details Column */}
                <td className="col-span-7">
                  {/* Amount and Type */}
                  <div className="flex items-center flex-wrap gap-1 mb-1">
                    <span className={`text-sm font-medium ${
                      entry.transactionType === "you will get"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      ₹{formatAmountWithoutPrefix(entry.amount)}
                    </span>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      entry.transactionType === "you will get"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {entry.transactionType}
                    </span>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-1">
                    <span>{formatDate(entry.transactionDate)}</span>
                    <span>•</span>
                    <span className="truncate max-w-[80px]">{entry.initiatedBy}</span>
                    <span>•</span>
                    <span className={`flex items-center ${
                      entry.confirmationStatus === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}>
                      {entry.confirmationStatus === "confirmed" ? (
                        <AiOutlineCheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AiOutlineClockCircle className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="col-span-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* File and Description Buttons */}
                    {entry.file && (
                      <button
                        onClick={() => handleFileClick({ ...entry })}
                        className="p-1 text-blue-600"
                      >
                        {entry.file.toLowerCase().endsWith('.pdf') ? (
                          <BsFilePdf className="w-3.5 h-3.5" />
                        ) : (
                          <AiOutlineFileImage className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    {entry.description && (
                      <button
                        onClick={() => {
                          setSelectedDescription(entry.description);
                          setShowDescriptionModal(true);
                        }}
                        className="p-1 text-blue-600"
                      >
                        <AiOutlineInfoCircle className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Action Buttons */}
                    {userId === entry.initiaterId ? (
                      <>
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="p-1 text-yellow-500"
                          title="Edit"
                        >
                          <MdEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(entry)}
                          className="p-1 text-red-500"
                          title="Delete"
                        >
                          <MdDelete className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSplitClick(entry)}
                          className="p-1 text-blue-500"
                          title="Split Transaction"
                        >
                          <BiGitBranch className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : entry.confirmationStatus === "pending" ? (
                      <button
                        onClick={() => updateTransactionStatus(entry._id)}
                        disabled={updating}
                        className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        {updating ? "..." : "Confirm"}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

