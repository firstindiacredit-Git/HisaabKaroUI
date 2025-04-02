import React from 'react';

const CompanyDetails = ({ billedBy, onBilledByChange }) => {
  return (
    <div className="border border-transparent dark:bg-gray-800 dark:border-gray-800 rounded p-6 bg-white">
      <h2 className="text-xl font-serif dark:text-white text-gray-900 mb-4">
        Company Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={billedBy.companyName}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, companyName: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your Company Name"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            GST Number
          </label>
          <input
            type="text"
            value={billedBy.gst}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, gst: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1  rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="GST Number"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            PAN Number
          </label>
          <input
            type="text"
            value={billedBy.pan}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, pan: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="PAN Number"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Company Address
          </label>
          <textarea
            value={billedBy.address}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, address: e.target.value })
            }
            rows={3}
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Company Address"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500 font-medium text-gray-700 mb-1">
            Company Phone
          </label>
          <input
            type="tel"
            value={billedBy.phone}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, phone: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Phone Number"
          />
        </div>
        <div>
          <label className="block text-sm dark:text-gray-500  font-medium text-gray-700 mb-1">
            Company Email
          </label>
          <input
            type="email"
            value={billedBy.email}
            onChange={(e) =>
              onBilledByChange({ ...billedBy, email: e.target.value })
            }
            className="block w-full bg-gray-200 border-gray-300 dark:bg-gray-700 p-1 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="company@example.com"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
