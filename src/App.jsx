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

function App() {
  return (
    <Routes>
      <Route path="/invoice" element={<InvoiceTemplates />} />
      <Route path="/invoice/classic" element={<ClassicInvoice />} />
      <Route path="/invoice/modern" element={<ModernInvoice />} />
      <Route path="/invoice/minimal" element={<MinimalInvoice />} />
      <Route path="/invoice/business" element={<BusinessInvoice />} />
      <Route path="/invoice/view/:id" element={<ViewInvoice />} />
      <Route path="/received-invoices" element={<ReceivedInvoices />} />
      <Route path="/saved-invoices" element={<SavedInvoices />} />
    </Routes>
  );
}

export default App;
