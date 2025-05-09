import React from 'react';
import { NavLink } from 'react-router-dom';

const InvoiceNavigation = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex space-x-4">
        <NavLink
          to="/saved-invoices"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          Saved Invoices
        </NavLink>
        <NavLink
          to="/sent-invoices"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          Sent Invoices
        </NavLink>
        <NavLink
          to="/received-invoices"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          Received Invoices
        </NavLink>
      </div>
    </div>
  );
};

export default InvoiceNavigation; 