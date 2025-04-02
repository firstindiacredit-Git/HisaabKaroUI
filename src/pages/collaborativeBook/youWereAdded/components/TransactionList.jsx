import React from "react";
import { Image } from "antd";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const TransactionList = ({
  viewMode,
  currentItems,
  currentPage,
  pageSize,
  userId,
  handleFileClick,
  updateTransactionStatus,
  updatingEntryId,
  openEditForm,
  handleDelete,
  modalState,
  setModalState,
  handleDownload,
}) => {
  return viewMode === "list" ? (
    <div className="overflow-x-auto">
      {/* List view table */}
      // ...existing code for list view...
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Grid view */}
      // ...existing code from renderGridView()...
    </div>
  );
};

export default TransactionList;
