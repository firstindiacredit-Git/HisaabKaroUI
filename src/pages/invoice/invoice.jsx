import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const classicPreview =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZS5uc..."; // Base64 image data for classic template

const modernPreview =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZS5uc..."; // Base64 image data for modern template

const minimalPreview =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZS5uc..."; // Base64 image data for minimal template

const businessPreview =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZS5uc..."; // Base64 image data for business template

// Alternative approach using SVG previews for better quality and smaller file size
const InvoiceTemplates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const templates = [
    {
      id: "classic",
      name: t("invoice.templates.classic.name"),
      description: t("invoice.templates.classic.description"),
      image: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Company Logo & Info */}
          <text x="40" y="40" className="font-bold text-lg" fill="#1F2937">
            INVOICE
          </text>
          <rect x="280" y="20" width="80" height="20" rx="2" fill="#E5E7EB" />
          <text x="290" y="34" className="text-xs" fill="#6B7280">
            #INV-2024001
          </text>

          {/* Billing Info */}
          <rect x="40" y="60" width="160" height="80" rx="4" fill="#F3F4F6" />
          <text x="50" y="80" className="text-sm font-semibold" fill="#374151">
            Bill From:
          </text>
          <text x="50" y="100" className="text-sm" fill="#6B7280">
            Your Company Name
          </text>
          <text x="50" y="120" className="text-sm" fill="#6B7280">
            123 Business St
          </text>

          <rect x="220" y="60" width="160" height="80" rx="4" fill="#F3F4F6" />
          <text x="230" y="80" className="text-sm font-semibold" fill="#374151">
            Bill To:
          </text>
          <text x="230" y="100" className="text-sm" fill="#6B7280">
            Client Name
          </text>
          <text x="230" y="120" className="text-sm" fill="#6B7280">
            456 Client Ave
          </text>

          {/* Table Header */}
          <rect x="40" y="160" width="320" height="30" rx="4" fill="#F3F4F6" />
          <text x="50" y="180" className="text-sm" fill="#374151">
            Item
          </text>
          <text x="200" y="180" className="text-sm" fill="#374151">
            Qty
          </text>
          <text x="280" y="180" className="text-sm" fill="#374151">
            Price
          </text>
          <text x="340" y="180" className="text-sm" fill="#374151">
            Total
          </text>

          {/* Table Rows */}
          <rect
            x="40"
            y="195"
            width="320"
            height="60"
            rx="4"
            fill="#FFFFFF"
            stroke="#E5E7EB"
          />

          {/* Totals */}
          <rect x="240" y="270" width="120" height="20" rx="4" fill="#1F2937" />
          <text x="250" y="284" className="text-sm" fill="white">
            Total: $1,234.00
          </text>
        </svg>
      ),
      path: "/invoice/classic",
    },
    {
      id: "modern",
      name: t("invoice.templates.modern.name"),
      description: t("invoice.templates.modern.description"),
      image: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Header */}
          <rect x="0" y="0" width="400" height="70" fill="#3B82F6" />
          <text x="40" y="45" className="text-2xl font-bold" fill="white">
            INVOICE
          </text>
          <text x="280" y="45" className="text-xl" fill="white">
            #2024-001
          </text>

          {/* Content */}
          <rect x="40" y="90" width="320" height="40" rx="20" fill="#EFF6FF" />
          <text x="60" y="115" className="text-sm" fill="#1F2937">
            March 15, 2024
          </text>

          {/* Bill Info */}
          <text x="40" y="160" className="text-lg font-semibold" fill="#1F2937">
            Bill To
          </text>
          <rect x="40" y="170" width="320" height="1" fill="#E5E7EB" />

          {/* Items */}
          <rect x="40" y="190" width="320" height="60" rx="8" fill="#F3F4F6" />

          {/* Total */}
          <rect
            x="240"
            y="260"
            width="120"
            height="30"
            rx="15"
            fill="#3B82F6"
          />
          <text x="260" y="280" className="text-sm" fill="white">
            Total: $2,450.00
          </text>
        </svg>
      ),
      path: "/invoice/modern",
    },
    {
      id: "minimal",
      name: t("invoice.templates.minimal.name"),
      description: t("invoice.templates.minimal.description"),
      image: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple Header */}
          <text x="40" y="40" className="text-xl" fill="#1F2937">
            Invoice
          </text>
          <text x="300" y="40" className="text-sm" fill="#6B7280">
            #MIN-001
          </text>

          <line x1="40" y1="60" x2="360" y2="60" stroke="#E5E7EB" />

          {/* Simple Content */}
          <text x="40" y="90" className="text-sm" fill="#374151">
            From:
          </text>
          <text x="40" y="110" className="text-sm" fill="#6B7280">
            Your Business
          </text>

          <text x="40" y="140" className="text-sm" fill="#374151">
            To:
          </text>
          <text x="40" y="160" className="text-sm" fill="#6B7280">
            Client Name
          </text>

          {/* Items */}
          <rect x="40" y="190" width="320" height="40" rx="2" fill="#F9FAFB" />

          {/* Simple Footer */}
          <line x1="40" y1="250" x2="360" y2="250" stroke="#E5E7EB" />
          <text x="300" y="270" className="text-sm" fill="#1F2937">
            $850.00
          </text>
        </svg>
      ),
      path: "/invoice/minimal",
    },
    {
      id: "business",
      name: t("invoice.templates.business.name"),
      description: t("invoice.templates.business.description"),
      image: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Professional Header */}
          <rect x="0" y="0" width="400" height="60" fill="#1E40AF" />
          <text x="40" y="38" className="text-xl font-bold" fill="white">
            BUSINESS INVOICE
          </text>

          {/* Professional Content */}
          <rect x="40" y="80" width="150" height="90" rx="4" fill="#BFDBFE" />
          <text x="50" y="100" className="text-sm font-semibold" fill="#1E40AF">
            From
          </text>
          <text x="50" y="120" className="text-xs" fill="#1E40AF">
            Corporation Name
          </text>
          <text x="50" y="140" className="text-xs" fill="#1E40AF">
            Business Address
          </text>

          <rect x="210" y="80" width="150" height="90" rx="4" fill="#BFDBFE" />
          <text
            x="220"
            y="100"
            className="text-sm font-semibold"
            fill="#1E40AF"
          >
            To
          </text>
          <text x="220" y="120" className="text-xs" fill="#1E40AF">
            Client Corporation
          </text>
          <text x="220" y="140" className="text-xs" fill="#1E40AF">
            Client Address
          </text>

          {/* Table */}
          <rect x="40" y="190" width="320" height="60" rx="4" fill="#EFF6FF" />
          <line x1="40" y1="210" x2="360" y2="210" stroke="#BFDBFE" />

          {/* Professional Footer */}
          <rect x="240" y="260" width="120" height="30" rx="4" fill="#1E40AF" />
          <text x="260" y="280" className="text-sm" fill="white">
            Total: $4,750.00
          </text>
        </svg>
      ),
      path: "/invoice/business",
    },
  ];

  return (
    <div className="w-full dark:bg-gray-900 bg-white mx-auto p-6">
      {/* Add navigation section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => navigate("/received-invoices")}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            <span>{t("invoice.received")}</span>
          </button>

          <button
            onClick={() => navigate("/saved-invoices")}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              ></path>
            </svg>
            <span>{t("invoice.saved")}</span>
          </button>

          <button
            onClick={() => navigate("/sent-invoices")}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <span>{t("invoice.sent")}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("invoice.chooseTemplate")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:border-gray-800 dark:bg-gray-800 bg-white"
            onClick={() => navigate(template.path)}
          >
            <div className="relative pt-[60%] dark:bg-gray-800 bg-gray-50">
              <div className="absolute top-0 left-0 w-full h-full p-4">
                {template.image}
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-700 border-gray-200">
              <h3 className="text-xl dark:text-white font-semibold mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 dark:text-white mb-4">
                {template.description}
              </p>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(template.path);
                }}
              >
                {t("invoice.useTemplate")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
