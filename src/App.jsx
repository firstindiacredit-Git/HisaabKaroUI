import React from "react";
import { Routes, Route } from "react-router-dom";
import InvoiceTemplates from "./pages/invoice/invoice";
import ClassicInvoice from "./pages/invoice/templates/ClassicInvoice";
import ModernInvoice from "./pages/invoice/templates/ModernInvoice";
import MinimalInvoice from "./pages/invoice/templates/MinimalInvoice";
import BusinessInvoice from "./pages/invoice/templates/BusinessInvoice";
import ViewInvoice from "./pages/invoice/ViewInvoice";
import ReceivedInvoices from "./pages/invoice/ReceivedInvoices";
import SavedInvoices from "./pages/invoice/SavedInvoices";
import SentInvoices from "./pages/invoice/SentInvoices";
import InvoiceNavigation from "./components/InvoiceNavigation";

const InvoiceLayout = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    <InvoiceNavigation />
    {children}
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/invoice" element={<InvoiceTemplates />} />
      <Route path="/invoice/classic" element={<ClassicInvoice />} />
      <Route path="/invoice/modern" element={<ModernInvoice />} />
      <Route path="/invoice/minimal" element={<MinimalInvoice />} />
      <Route path="/invoice/business" element={<BusinessInvoice />} />
      <Route path="/invoice/view/:id" element={<ViewInvoice />} />
      <Route
        path="/received-invoices"
        element={
          <InvoiceLayout>
            <ReceivedInvoices />
          </InvoiceLayout>
        }
      />
      <Route
        path="/saved-invoices"
        element={
          <InvoiceLayout>
            <SavedInvoices />
          </InvoiceLayout>
        }
      />
      <Route
        path="/sent-invoices"
        element={
          <InvoiceLayout>
            <SentInvoices />
          </InvoiceLayout>
        }
      />
    </Routes>
  );
}

export default App;
