import React from 'react';

const ClientDetails = ({ billedTo, clients, selectedClient, onBilledToChange, onClientSelect }) => {
  return (
    <div className="border border-transparent dark:bg-gray-800 dark:border-gray-800 rounded p-6 bg-white">
      <h2 className="text-xl font-serif  dark:text-white text-gray-900 mb-4">
        Client Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Select Client
          </label>
          <select
            value={selectedClient}
            onChange={(e) => onClientSelect(e.target.value)}
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            value={billedTo.name}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, name: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Client Name"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            GST Number
          </label>
          <input
            type="text"
            value={billedTo.gst}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, gst: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="GST Number"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            PAN Number
          </label>
          <input
            type="text"
            value={billedTo.pan}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, pan: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="PAN Number"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Client Address
          </label>
          <textarea
            value={billedTo.address}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, address: e.target.value })
            }
            rows={3}
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Client Address"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Client Phone
          </label>
          <input
            type="tel"
            value={billedTo.phone}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, phone: e.target.value })
            }
            className="block w-full bg-gray-200  border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Phone Number"
          />
        </div>
        <div>
          <label className="block text-sm Client Information dark:text-gray-500 font-medium text-gray-700 mb-1">
            Client Email
          </label>
          <input
            type="email"
            value={billedTo.email}
            onChange={(e) =>
              onBilledToChange({ ...billedTo, email: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="client@example.com"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
