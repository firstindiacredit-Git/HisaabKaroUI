import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "../../../config/axios";
import data from "../../../data/country.js";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import InvoiceHeader from "../components/InvoiceHeader";
import CompanyDetails from "../components/CompanyDetails";
import ClientDetails from "../components/ClientDetails";
import ItemsTable from "../components/ItemsTable";
import TotalSection from "../components/TotalSection";
import InvoiceLogo from "../components/InvoiceLogo";
import TermsAndConditions from "../components/TermsAndConditions";
import { Input } from "antd";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const BusinessInvoice = () => {
  const invoiceRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "INR",
    billedBy: {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      gst: "",
      pan: "",
      logo: null,
    },
    billedTo: {
      name: "",
      address: "",
      phone: "",
      email: "",
      gst: "",
      pan: "",
    },
    items: [],
    tax: {
      enabled: false,
      rate: "",
      label: "Tax",
    },
    discount: {
      enabled: false,
      rate: "",
    },
    termsAndConditions: [],
    logo: {
      dataUrl: null,
      scale: 100, // Default scale percentage
    },
    colors: {
      headerBackground: "#f8f9fa",
      accentColor: "#007bff",
      textColor: "#212529",
    },
  });

  const navigate = useNavigate();

  // Define constants for API URLs
  const API_URL = "http://localhost:5100/api/v3/client/getAll-clients";

  // Update the currency sorting and grouping logic
  const getUniqueCurrencies = () => {
    // Priority currencies (INR and USD)
    const priorityCurrencies = ["INR", "USD"];

    // Create a map of currencies with their primary countries
    const currencyCountryMap = {
      USD: "United States",
      INR: "India",
      EUR: "European Union",
      GBP: "United Kingdom",
      JPY: "Japan",
      AUD: "Australia",
      CAD: "Canada",
      CNY: "China",
      HKD: "Hong Kong",
      SGD: "Singapore",
      AED: "United Arab Emirates",
      PKR: "Pakistan",
      THB: "Thailand",
      MYR: "Malaysia",
    };

    // Get all unique currencies
    const uniqueCurrencySet = new Set(data.map((country) => country.currency));
    const allCurrencies = Array.from(uniqueCurrencySet).map((currency) => ({
      currency,
      countryName:
        currencyCountryMap[currency] ||
        data.find((c) => c.currency === currency)?.countryName ||
        currency,
    }));

    // Separate priority and other currencies
    const priorityList = allCurrencies
      .filter((item) => priorityCurrencies.includes(item.currency))
      .sort(
        (a, b) =>
          priorityCurrencies.indexOf(a.currency) -
          priorityCurrencies.indexOf(b.currency)
      );

    const otherList = allCurrencies
      .filter((item) => !priorityCurrencies.includes(item.currency))
      .sort((a, b) => a.currency.localeCompare(b.currency));

    return [...priorityList, { divider: true }, ...otherList];
  };

  // Replace the existing uniqueCurrencies definition with:
  const uniqueCurrencies = getUniqueCurrencies();

  // Calculation functions
  const calculateItemTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return quantity * price;
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );
  };

  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    const taxRate = parseFloat(invoiceData.tax.rate) || 0;
    return (subtotal * taxRate) / 100;
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    const discountRate = parseFloat(invoiceData.discount.rate) || 0;
    return (subtotal * discountRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTaxAmount();
    const discount = calculateDiscountAmount();
    return subtotal + tax - discount;
  };

  // Helper functions
  const handleLogoChange = (logoData) => {
    setInvoiceData((prev) => ({
      ...prev,
      logo: {
        dataUrl: logoData.dataUrl,
        scale: logoData.scale || prev.logo.scale,
      },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          billedBy: {
            ...prev.billedBy,
            logo: reader.result,
          },
          logo: {
            dataUrl: reader.result,
            scale: prev.logo.scale,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log("Generating PDF...");
      const doc = new jsPDF();

      // Convert hex colors to RGB for PDF
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      };

      // Get RGB values for colors
      const headerBg = hexToRgb(invoiceData.colors.headerBackground) || {
        r: 248,
        g: 249,
        b: 250,
      };
      const textColor = hexToRgb(invoiceData.colors.textColor) || {
        r: 33,
        g: 37,
        b: 41,
      };
      const accentColor = hexToRgb(invoiceData.colors.accentColor) || {
        r: 0,
        g: 123,
        b: 255,
      };

      // Set document encoding for proper symbol rendering
      doc.setFont("helvetica");
      doc.setCharSpace(0);

      const leftMargin = 15;
      const rightMargin = 15;
      const topMargin = 15;

      // Calculate logo dimensions first to determine header height
      let logoImage = null;
      let logoWidth = 0;
      let logoHeight = 35; // default header height

      if (invoiceData.logo.dataUrl) {
        try {
          logoImage = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              const pdfPointRatio = 72 / 96;
              const maxWidth =
                (doc.internal.pageSize.width - leftMargin - rightMargin) / 2;

              // Calculate dimensions based on scale
              const scaleFactor = invoiceData.logo.scale / 100;
              const baseWidth = 100 * pdfPointRatio; // Base width of 100 points
              logoWidth = baseWidth * scaleFactor;
              const aspectRatio = img.width / img.height;
              logoHeight = logoWidth / aspectRatio;

              // Ensure the logo fits within the page
              if (logoWidth > maxWidth) {
                const scale = maxWidth / logoWidth;
                logoWidth = maxWidth;
                logoHeight = logoHeight * scale;
              }

              resolve(img);
            };
            img.onerror = () => {
              console.error("Error loading logo image");
              resolve(null);
            };
            img.src = invoiceData.logo.dataUrl;
          });
        } catch (error) {
          console.error("Error processing logo:", error);
        }
      }

      // Calculate header height based on content
      const minHeaderHeight = 35;
      const headerHeight = Math.max(minHeaderHeight, logoHeight + 10); // Add padding

      // Add header background
      doc.setFillColor(headerBg.r, headerBg.g, headerBg.b);
      doc.rect(
        leftMargin,
        topMargin,
        doc.internal.pageSize.width - leftMargin - rightMargin,
        headerHeight,
        "F"
      );

      // Add header text and invoice details
      doc.setTextColor(textColor.r, textColor.g, textColor.b);

      // Add INVOICE text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("INVOICE", leftMargin + 5, topMargin + 15);

      // Add invoice details below INVOICE heading
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const invoiceDetails = [
        `Invoice Number: ${invoiceData.invoiceNumber}`,
        `Date: ${invoiceData.date}`,
        `Due Date: ${invoiceData.dueDate}`,
      ];
      doc.text(invoiceDetails, leftMargin + 5, topMargin + 25);

      // Add logo if present
      if (logoImage && logoWidth > 0 && logoHeight > 0) {
        const logoX = doc.internal.pageSize.width - rightMargin - logoWidth;
        const logoY = topMargin + (headerHeight - logoHeight) / 2;

        doc.addImage(
          invoiceData.logo.dataUrl,
          "PNG",
          logoX,
          logoY,
          logoWidth,
          logoHeight,
          undefined,
          "FAST"
        );
      }

      // Reset text color for rest of the document
      doc.setTextColor(0, 0, 0);

      // Function to add address details with multi-line support
      const addAddressDetails = (title, details, startX, startY, maxWidth) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(title, startX, startY);

        doc.setFont("helvetica", "normal");
        let currentY = startY + 5;

        // Company/Client Name
        if (details.companyName || details.name) {
          doc.text(details.companyName || details.name, startX, currentY);
          currentY += 5;
        }

        // Address - Split into multiple lines if needed
        if (details.address) {
          const addressLines = doc.splitTextToSize(details.address, maxWidth);
          addressLines.forEach((line) => {
            doc.text(line, startX, currentY);
            currentY += 5;
          });
        }

        // Contact Details
        if (details.phone) {
          doc.text(`Phone: ${details.phone}`, startX, currentY);
          currentY += 5;
        }
        if (details.email) {
          doc.text(`Email: ${details.email}`, startX, currentY);
          currentY += 5;
        }
        if (details.gst) {
          doc.text(`GST: ${details.gst}`, startX, currentY);
          currentY += 5;
        }
        if (details.pan) {
          doc.text(`PAN: ${details.pan}`, startX, currentY);
          currentY += 5;
        }

        return currentY; // Return the last Y position
      };

      // Add company and client details with proper spacing
      const companyDetailsWidth = 150; // Maximum width for address lines
      const startY = headerHeight + 20;

      // Add billed by details
      const billedByY = addAddressDetails(
        "Billed By:",
        invoiceData.billedBy,
        leftMargin,
        startY,
        companyDetailsWidth
      );

      // Add billed to details
      const billedToY = addAddressDetails(
        "Billed To:",
        invoiceData.billedTo,
        doc.internal.pageSize.width / 2,
        startY,
        companyDetailsWidth
      );

      // Calculate the starting Y position for the table
      // Use the maximum Y position from both columns
      const tableStartY = Math.max(billedByY, billedToY) + 10;

      // Prepare table data
      console.log("Preparing table data...");
      const tableData = invoiceData.items.map((item, index) => [
        (index + 1).toString(),
        item.description || "",
        item.quantity.toString(),
        `${invoiceData.currency} ${parseFloat(item.price).toLocaleString(
          "en-IN",
          { minimumFractionDigits: 2 }
        )}`,
        `${invoiceData.currency} ${calculateItemTotal(item).toLocaleString(
          "en-IN",
          { minimumFractionDigits: 2 }
        )}`,
      ]);

      console.log("Generating table...");
      doc.autoTable({
        startY: tableStartY,
        head: [["#", "Description", "Qty", "Price", "Total"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [headerBg.r, headerBg.g, headerBg.b],
          textColor: [textColor.r, textColor.g, textColor.b],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
          cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" }, // # column
          1: { cellWidth: "auto", halign: "left" }, // Description - will take remaining space
          2: { cellWidth: 30, halign: "center" }, // Quantity
          3: { cellWidth: 45, halign: "right" }, // Price
          4: { cellWidth: 35, halign: "right" }, // Total - reduced
        },
        styles: {
          fontSize: 8,
          cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          valign: "middle",
          overflow: "linebreak",
          minCellHeight: 0,
        },
        margin: { left: leftMargin, right: rightMargin },
        tableWidth: doc.internal.pageSize.width - (leftMargin + rightMargin), // Full width minus margins
        didParseCell: function (data) {
          // Ensure numbers are right-aligned and text is left-aligned
          const col = data.column.index;
          if (data.row.section === "body") {
            if (col === 0) {
              data.cell.styles.halign = "center";
            } else if (col === 1) {
              data.cell.styles.halign = "left";
            } else {
              data.cell.styles.halign = "right";
            }
          }
        },
        didDrawPage: function (data) {
          data.settings.margin.top = topMargin;
          data.settings.margin.bottom = 15;
        },
      });

      // Get the last Y position after the table
      const finalY = doc.lastAutoTable.finalY;

      // Add totals section
      let currentY = finalY + 10;
      const xLabel = doc.internal.pageSize.width - 80;
      const xAmount = doc.internal.pageSize.width - rightMargin;

      // Helper function to add total lines
      const addTotalLine = (doc, label, amount, isBold = false, currentY) => {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(isBold ? 9 : 8);
        doc.text(label, xLabel, currentY);
        doc.text(amount, xAmount, currentY, { align: "right" });
        return currentY + 6; // Return updated Y position
      };

      // Add subtotal, tax, discount and total
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();
      const discountAmount = calculateDiscountAmount();
      const total = calculateTotal();

      // Always show subtotal
      currentY = addTotalLine(
        doc,
        "Subtotal:",
        formatAmount(subtotal),
        false,
        currentY
      );

      // Show discount if it exists or is not zero
      if (invoiceData.discount?.rate > 0) {
        currentY = addTotalLine(
          doc,
          `Discount (${invoiceData.discount.rate}%):`,
          `-${formatAmount(discountAmount)}`,
          false,
          currentY
        );
      }

      // Show tax if it exists or is not zero
      if (invoiceData.tax?.rate > 0) {
        currentY = addTotalLine(
          doc,
          `${invoiceData.tax.label || "Tax"} (${invoiceData.tax.rate}%):`,
          formatAmount(taxAmount),
          false,
          currentY
        );
      }

      // Add a line before total
      currentY += 1;
      doc.setDrawColor(200, 200, 200);
      doc.line(xLabel, currentY, xAmount, currentY);
      currentY += 4;

      // Add total
      currentY = addTotalLine(
        doc,
        "Total:",
        formatAmount(total),
        true,
        currentY
      );

      // Add Terms and Conditions
      if (
        invoiceData.termsAndConditions &&
        invoiceData.termsAndConditions.length > 0
      ) {
        currentY += 20; // Add space after totals

        // Add Terms & Conditions header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Terms & Conditions:", leftMargin, currentY);

        // Add terms and conditions content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        currentY += 8;

        invoiceData.termsAndConditions.forEach((term, index) => {
          // Add numbered term
          const text = `${index + 1}. ${term}`;
          const textLines = doc.splitTextToSize(
            text,
            doc.internal.pageSize.width - leftMargin - rightMargin - 10
          );

          textLines.forEach((line) => {
            currentY += 5;
            doc.text(line, leftMargin + 5, currentY);
          });
        });
      }

      // Add signature section at the bottom
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const signatureY = pageHeight - 40;

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);

      // Add authorized signature line on the right
      const signatureWidth = 60;
      const signatureX = pageWidth - rightMargin - signatureWidth;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      // Add note about terms and conditions
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);

      // Add footer with branding
      const footerY = pageHeight - 45;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(
        leftMargin,
        footerY,
        doc.internal.pageSize.width - rightMargin,
        footerY
      );

      // Set footer text styles
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(41, 98, 255); // Brand color

      // Add main branding
      doc.text("HISAABKARO.COM", doc.internal.pageSize.width / 2, footerY + 8, {
        align: "center",
      });

      // Add description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(128, 128, 128); // Gray color
      const description =
        "Hisaab Karo is a digital khata book designed to assist small businesses in managing their accounts, expenses, and customer credit records.";
      const descriptionLines = doc.splitTextToSize(
        description,
        doc.internal.pageSize.width - (leftMargin + rightMargin) * 2
      );
      descriptionLines.forEach((line, index) => {
        doc.text(
          line,
          doc.internal.pageSize.width / 2,
          footerY + 15 + index * 4,
          { align: "center" }
        );
      });

      // Add website with link
      doc.setTextColor(41, 98, 255);
      doc.setFontSize(8);
      doc.textWithLink(
        "Visit us at: www.hisaabkaro.com",
        doc.internal.pageSize.width / 2,
        footerY + 25,
        {
          url: "https://hisaabkaro.com/",
          align: "center",
        }
      );

      // Add generated by note
      doc.setTextColor(128, 128, 128);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.text(
        "This invoice is generated by HisaabKaro.com - Your Smart Digital Accounting Partner",
        doc.internal.pageSize.width / 2,
        pageHeight - 15,
        { align: "center" }
      );

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Save the PDF
      console.log("Saving PDF...");
      const fileName = `Invoice-${invoiceData.invoiceNumber || "draft"}.pdf`;
      doc.save(fileName);
      console.log("PDF generated successfully:", fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check the console for details.");
    }
  };

  const handleAddItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: "",
          price: "",
          total: 0,
        },
      ],
    }));
  };

  const handleItemChange = (index, updatedItem) => {
    const quantity = parseFloat(updatedItem.quantity) || 0;
    const price = parseFloat(updatedItem.price) || 0;
    const total = quantity * price;

    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...updatedItem,
      quantity: updatedItem.quantity,
      price: updatedItem.price,
      total: total,
    };

    setInvoiceData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleItemRemove = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleTaxChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      tax: {
        ...prev.tax,
        [field]: field === "rate" ? (value === "" ? "" : Number(value)) : value,
        enabled: field === "enabled" ? value : prev.tax.enabled,
      },
    }));
  };

  const handleDiscountChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        [field]: field === "rate" ? (value === "" ? "" : Number(value)) : value,
        enabled: field === "enabled" ? value : prev.discount.enabled,
      },
    }));
  };

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]); // Reset clients on error
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    };
    fetchClients();
  }, []);

  const handleClientSelect = async (clientId) => {
    setSelectedClient(clientId);
    if (!clientId) {
      setInvoiceData((prev) => ({
        ...prev,
        billedTo: {
          name: "",
          address: "",
          phone: "",
          email: "",
          gst: "",
          pan: "",
        },
      }));
      return;
    }

    try {
      const selectedClientData = clients.find(
        (client) => client._id === clientId
      );
      if (selectedClientData) {
        const updatedBilledTo = {
          name: selectedClientData.name || "",
          address: selectedClientData.address || "",
          phone: selectedClientData.mobile || "",
          email: selectedClientData.email || "",
          gst: selectedClientData.gst || "",
          pan: selectedClientData.pan || "",
        };
        setInvoiceData((prev) => ({
          ...prev,
          billedTo: updatedBilledTo,
        }));
      }
    } catch (error) {
      console.error("Error setting client details:", error);
    }
  };

  const formatAmount = (amount) => {
    try {
      const num = parseFloat(amount);
      if (isNaN(num)) return `${invoiceData.currency} 0.00`;

      // Format with Indian numbering system
      const parts = num.toFixed(2).split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1];

      // Format integer part with Indian grouping (e.g., 1,23,456)
      let formattedInteger = "";
      const digits = integerPart.split("").reverse();

      for (let i = 0; i < digits.length; i++) {
        if (i === 3) formattedInteger = "," + formattedInteger;
        else if (i > 3 && (i - 3) % 2 === 0)
          formattedInteger = "," + formattedInteger;
        formattedInteger = digits[i] + formattedInteger;
      }

      return `${invoiceData.currency} ${formattedInteger}.${decimalPart}`;
    } catch (error) {
      console.error("Error formatting amount:", error);
      return `${invoiceData.currency} 0.00`;
    }
  };

  // Add currency change handler
  const handleCurrencyChange = (event) => {
    setInvoiceData((prev) => ({
      ...prev,
      currency: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const subtotal = calculateSubtotal();
      const tax = calculateTaxAmount();
      const total = calculateTotal();

      const response = await axios.post("/api/invoices/save-invoice", {
        template: "business",
        invoiceData,
        status: "save",
        subtotal,
        tax,
        total,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: calculateItemTotal(item),
        })),
        billingDetails: {
          from: invoiceData.billedBy,
          to: invoiceData.billedTo,
        },
        dueDate: invoiceData.dueDate,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
      });

      if (response.data.success) {
        Modal.success({
          title: "Success",
          content: "Invoice saved successfully!",
          onOk: () => navigate("/saved-invoices"),
        });
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      Modal.error({
        title: "Error",
        content:
          "Failed to save invoice. Please fill all required fields and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedClient) {
      Modal.error({
        title: "Error",
        content: "Please select a client to send the invoice.",
      });
      return;
    }

    try {
      setLoading(true);
      const subtotal = calculateSubtotal();
      const tax = calculateTaxAmount();
      const total = calculateTotal();

      // Get the selected client's details
      const client = clients.find((c) => c._id === selectedClient);
      if (!client) {
        throw new Error("Selected client not found");
      }

      const response = await axios.post("/api/invoices/sent-invoice", {
        template: "business",
        recipientEmail: client.email,
        recipientId: client._id,
        status: "sent",
        subtotal,
        tax,
        total,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: calculateItemTotal(item),
        })),
        billingDetails: {
          from: {
            companyName: invoiceData.billedBy.companyName,
            email: invoiceData.billedBy.email,
            address: invoiceData.billedBy.address,
            phone: invoiceData.billedBy.phone,
            gst: invoiceData.billedBy.gst,
            pan: invoiceData.billedBy.pan,
            logo: invoiceData.billedBy.logo,
          },
          to: {
            name: client.name,
            email: client.email,
            address: client.address,
            phone: client.phone,
            gst: client.gst,
            pan: client.pan,
          },
        },
        dueDate: invoiceData.dueDate,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
        currency: invoiceData.currency,
        termsAndConditions: invoiceData.termsAndConditions,
      });

      if (response.data.success) {
        Modal.success({
          title: "Success",
          content: "Invoice sent successfully!",
          onOk: () => navigate("/invoice/sent"),
        });
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      Modal.error({
        title: "Error",
        content:
          error.response?.data?.message ||
          "Failed to send invoice. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 py-8">
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
          .color-picker-label {
            font-size: 0.875rem;
            color: #4B5563;
            margin-bottom: 0.5rem;
          }
          .color-picker-group {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .color-picker-input {
            width: 100px;
            height: 38px;
            padding: 4px;
            border: 1px solid #D1D5DB;
            border-radius: 0.375rem;
            cursor: pointer;
          }
        `}
      </style>
      <div
        id="invoice-container"
        className="w-full mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-end mb-6">
          <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg p-2">
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </InputLabel>
              <Select
                value={invoiceData.currency}
                onChange={handleCurrencyChange}
                label="Currency"
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null, // This ensures the menu opens below
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Set maximum height for scrolling
                    },
                  },
                }}
              >
                {uniqueCurrencies.map((item, index) =>
                  item.divider ? (
                    <MenuItem
                      key="divider"
                      divider
                      disabled
                      sx={{
                        borderTop: "1px solid blue",
                        borderBottom: "2px solid #eee",
                        my: 1,
                        opacity: 1,
                      }}
                    />
                  ) : (
                    <MenuItem
                      key={item.currency}
                      value={item.currency}
                      sx={
                        ["INR", "USD"].includes(item.currency)
                          ? {
                              fontWeight: "bold",
                              backgroundColor: "rgba(0,0,0,0.02)",
                            }
                          : {}
                      }
                    >
                      {item.currency} - {item.countryName}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Color Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                Header Background
              </label>
              <div className="flex items-center  gap-3">
                <Input
                  type="color"
                  value={invoiceData.colors.headerBackground}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        headerBackground: e.target.value,
                      },
                    }))
                  }
                  className="h-10 w-20 p-1 border-none outline-none dark:bg-gray-800 bg-gray-200"
                />
                <span className="text-sm text-gray-600">
                  {invoiceData.colors.headerBackground}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={invoiceData.colors.accentColor}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      colors: { ...prev.colors, accentColor: e.target.value },
                    }))
                  }
                  className="h-10 w-20 p-1 border-none outline-none dark:bg-gray-800 bg-gray-200"
                />
                <span className="text-sm text-gray-600">
                  {invoiceData.colors.accentColor}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={invoiceData.colors.textColor}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      colors: { ...prev.colors, textColor: e.target.value },
                    }))
                  }
                  className="h-10 w-20 p-1 border-none outline-none dark:bg-gray-800 bg-gray-200"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {invoiceData.colors.textColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8">
          <InvoiceHeader
            onDownloadPDF={handleDownloadPDF}
            colors={invoiceData.colors}
            logo={invoiceData.logo}
            invoiceData={invoiceData}
            onInvoiceDataChange={setInvoiceData}
          />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <CompanyDetails
              billedBy={invoiceData.billedBy}
              onBilledByChange={(newBilledBy) =>
                setInvoiceData((prev) => ({ ...prev, billedBy: newBilledBy }))
              }
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <ClientDetails
              billedTo={invoiceData.billedTo}
              clients={clients}
              selectedClient={selectedClient}
              onBilledToChange={(newBilledTo) =>
                setInvoiceData((prev) => ({ ...prev, billedTo: newBilledTo }))
              }
              onClientSelect={handleClientSelect}
            />
          </div>
        </div>

        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4">
          <ItemsTable
            items={invoiceData.items}
            currency={invoiceData.currency}
            onItemChange={handleItemChange}
            onItemRemove={handleItemRemove}
            onAddItem={handleAddItem}
          />
        </div>

        <div className="flex justify-end mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <TotalSection
              invoiceData={invoiceData}
              onInvoiceDataChange={setInvoiceData}
              calculateSubtotal={calculateSubtotal}
              calculateTaxAmount={calculateTaxAmount}
              calculateTotal={calculateTotal}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-8">
          <TermsAndConditions
            terms={invoiceData.termsAndConditions}
            onTermsChange={(newTerms) =>
              setInvoiceData((prev) => ({
                ...prev,
                termsAndConditions: newTerms,
              }))
            }
          />
        </div>

        <div className="flex justify-end mt-8">
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            {invoiceData.logo.dataUrl && (
              <div className="flex items-center border rounded p-2 bg-white dark:bg-gray-800">
                <img
                  src={invoiceData.logo.dataUrl}
                  alt="Invoice Logo Preview"
                  style={{
                    width: `${Math.min(invoiceData.logo.scale, 100)}%`,
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save Invoice
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Send Invoice
            </button>

            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4">
          <InvoiceLogo onLogoChange={handleLogoChange} />
        </div>

        {/* Client Selection Modal */}
        <Modal
          title="Select Client"
          open={isModalOpen}
          onOk={handleSend}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={loading}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Client to Send Invoice
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Choose a client...</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BusinessInvoice;
