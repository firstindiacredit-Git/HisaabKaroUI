import { useCallback } from 'react';
import { Image } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { handleFileUrl } from '../../../../utils/urlUtils';
import { handleFileView } from '../utils/fileHandlers';
import { formatDate, formatAmountWithoutPrefix } from '../utils/formatters';

export const useTransactionHandlers = ({
  transaction,
  userId,
  sortConfig,
  setSortConfig,
  statusFilter,
  setStatusFilter,
  addedByFilter,
  setAddedByFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setSelectedEntry,
  setShowSplitModal,
  openEditForm,
  setSelectedFile,
  setShowPDFModal,
  setShowImagePreview,
  setPreviewImage,
}) => {
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleAddedByFilter = (addedBy) => {
    setAddedByFilter(addedBy);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    switch (value) {
      case "oldest":
        setSortConfig({ key: "transactionDate", direction: "asc" });
        break;
      case "newest":
        setSortConfig({ key: "transactionDate", direction: "desc" });
        break;
      case "amount_high":
        setSortConfig({ key: "amount", direction: "desc" });
        break;
      case "amount_low":
        setSortConfig({ key: "amount", direction: "asc" });
        break;
      default:
        setSortConfig({ key: "transactionDate", direction: "desc" });
    }
  };

  const handleEditClick = (entry) => {
    if (openEditForm) {
      openEditForm(entry);
    }
  };

  const handleFileClick = (entry) => {
    if (!entry || !entry.file) return;
    
    const { url } = handleFileUrl(entry.file);
    const fileType = entry.file.toLowerCase().split('.').pop();

    // Handle different file types
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      // For images, show in Image preview modal
      setPreviewImage(url);
      setShowImagePreview(true);
    } else if (fileType === 'pdf') {
      // For PDFs, show in modal
      setSelectedFile(url);
      setShowPDFModal(true);
    } else {
      // For other file types, open in new tab
      window.open(url, '_blank');
    }
  };

  const handleSplitClick = (entry) => {
    if (!entry || !entry.amount) {
      console.error('Invalid entry for split:', entry);
      return;
    }

    const enrichedEntry = {
      ...entry,
      _id: entry._id,
      transactionId: transaction?._id,
      amount: parseFloat(entry.amount),
      description: entry.description || '',
      transactionType: entry.transactionType,
      bookId: transaction?.bookId?._id || transaction?.bookId,
      initiatedBy: entry.initiatedBy,
      transactionDate: entry.transactionDate,
      file: entry.file,
      confirmationStatus: entry.confirmationStatus
    };
    setSelectedEntry(enrichedEntry);
    setShowSplitModal(true);
  };

  const exportToPDF = async (shouldDownload = true) => {
    try {
      if (!transaction?.transactionHistory) {
        console.error("No transaction data available");
        return;
      }

      const doc = new jsPDF({
        format: "a4",
        unit: "mm",
      });

      // Add footer function
      const addFooter = () => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 25;

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, footerY, pageWidth - 14, footerY);

        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("HisaabKaro", 14, footerY + 8);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Your Digital Expense Management Partner", 14, footerY + 14);

        doc.setTextColor(37, 99, 235);
        doc.text("www.hisaabkaro.com", pageWidth / 2, footerY + 14, {
          align: "center",
        });

        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        const currentDate = new Date().toLocaleDateString("en-US");
        const year = new Date().getFullYear();
        doc.text(`Generated: ${currentDate}`, 14, footerY + 20);
        doc.text(
          ` ${year} HisaabKaro. All rights reserved`,
          pageWidth - 14,
          footerY + 20,
          { align: "right" }
        );
      };

      // Add cards and table
      const addContent = () => {
        // Title
        doc.setFontSize(24);
        doc.text("Transaction History", 14, 20);

        // Cards
        const pageWidth = doc.internal.pageSize.width;
        const marginX = 14;
        const cardWidth = 42;
        const cardHeight = 30;
        const startX = marginX;
        const startY = 30;
        const gap = 6;

        // Add cards (Your Name, Client Name, Book Name, Outstanding Balance)
        addCards(doc, transaction, { startX, startY, cardWidth, cardHeight, gap });

        // Add transaction table
        addTransactionTable(doc, transaction, startY + cardHeight + 15, marginX);
      };

      addContent();
      addFooter();

      // Instead of calling save(), use output() to get blob
      const pdfBlob = doc.output('blob');
      
      if (shouldDownload) {
        // Only create download link if shouldDownload is true
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transaction_history.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the URL
      }
      
      // Always return the blob for WhatsApp sharing
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  return {
    handleSort,
    handleStatusFilter,
    handleAddedByFilter,
    handleItemsPerPageChange,
    handleSortChange,
    handleEditClick,
    handleFileClick,
    handleSplitClick,
    exportToPDF,
  };
};

// Helper functions for PDF generation
function addCards(doc, transaction, { startX, startY, cardWidth, cardHeight, gap }) {
  // Your Name card (Green)
  addCard(doc, {
    title: "Your Name",
    value: transaction?.userId?.name || localStorage.getItem("user") || "",
    color: [34, 197, 94],
    x: startX,
    y: startY,
    width: cardWidth,
    height: cardHeight,
  });

  // Client Name card (Orange)
  addCard(doc, {
    title: "Client Name",
    value: transaction?.clientUserId?.name || "",
    color: [249, 115, 22],
    x: startX + cardWidth + gap,
    y: startY,
    width: cardWidth,
    height: cardHeight,
  });

  // Book Name card (Purple)
  addCard(doc, {
    title: "Book Name",
    value: transaction?.bookId?.bookname || "",
    color: [147, 51, 234],
    x: startX + (cardWidth + gap) * 2,
    y: startY,
    width: cardWidth,
    height: cardHeight,
  });

  // Outstanding Balance card (Blue)
  addCard(doc, {
    title: "Outstanding",
    value: transaction.outstandingBalance >= 0
      ? formatAmountWithoutPrefix(transaction.outstandingBalance)
      : `-${formatAmountWithoutPrefix(transaction.outstandingBalance)}`,
    color: [59, 130, 246],
    x: startX + (cardWidth + gap) * 3,
    y: startY,
    width: cardWidth,
    height: cardHeight,
  });
}

function addCard(doc, { title, value, color, x, y, width, height }) {
  doc.setFillColor(...color);
  doc.roundedRect(x, y, width, height, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(title, x + 5, y + 10);
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(value, width - 10);
  doc.text(lines, x + 5, y + 20);
}

function addTransactionTable(doc, transaction, startY, marginX) {
  const tableData = transaction.transactionHistory.map((entry, index) => [
    (index + 1).toString(),
    formatDate(entry.transactionDate),
    entry.initiatedBy,
    entry.transactionType,
    formatAmountWithoutPrefix(entry.amount),
    entry.description || "",
    entry.confirmationStatus,
  ]);

  autoTable(doc, {
    head: [["#", "Date", "Initiated By", "Type", "Amount", "Description", "Status"]],
    body: tableData,
    startY,
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [41, 128, 185],
      fontSize: 10,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: marginX },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 35 },
      6: { cellWidth: 25 },
    },
  });
}
