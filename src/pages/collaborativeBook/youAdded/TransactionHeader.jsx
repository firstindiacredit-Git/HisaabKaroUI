import React from 'react';

const TransactionHeader = ({ transaction }) => {
  if (!transaction) return null;

  const bookName = transaction?.bookId?.bookname || 'N/A';
  const userName = transaction?.userId?.name || 'N/A';
  const clientName = transaction?.clientUserId?.name || 'N/A';
  const outstandingBalance = transaction?.outstandingBalance || 0;

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  // Mobile card component for better reusability
  const MobileCard = ({ icon, label, value, color }) => (
    <div className={`flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0 ${color}`}>
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{value}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Mobile View */}
      <div className="block sm:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent p-3 border-b border-gray-100">
          Transaction Details
        </h1>
        <div className="divide-y divide-gray-100">
          <MobileCard
            icon={<svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>}
            label="Book"
            value={bookName}
            color="bg-blue-50/50"
          />
          <MobileCard
            icon={<svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            label="Balance"
            value={Math.abs(outstandingBalance).toLocaleString('en-IN')}
            color="bg-amber-50/50"
          />
          <MobileCard
            icon={<svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>}
            label="User"
            value={getFirstName(userName)}
            color="bg-emerald-50/50"
          />
          <MobileCard
            icon={<svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>}
            label="Client"
            value={getFirstName(clientName)}
            color="bg-purple-50/50"
          />
        </div>
      </div>

      {/* Desktop View - Keep existing grid layout */}
      <div className="hidden sm:block p-8">
        <h1 className="text-3xl font-bold dark:text-white dark:bg-gray-800 bg-blue-600 bg-clip-text text-transparent mb-8">
          Transaction Details
        </h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book Name Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 dark:ring-blue-500 dark:bg-blue-400  rounded-xl p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-blue-600 dark:text-blue-600 mb-1 sm:mb-2 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-semibold text-sm sm:text-base">Book Name</span>
              </div>
              <p className="text-gray-700 dark:text-white font-medium text-sm sm:text-base truncate">{bookName}</p>
            </div>
          </div>

          {/* User Name Card */}
          {/* <div className="relative group">
                <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 dark:ring-emerald-500 dark:bg-emerald-400  rounded-xl p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-emerald-600 dark:text-emerald-600 mb-1 sm:mb-2 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold text-sm sm:text-base">User Name</span>
              </div>
              <p className="text-gray-700 dark:text-white font-medium text-sm sm:text-base truncate">
                <span className="sm:hidden">{getFirstName(userName)}</span>
                <span className="hidden sm:block">{userName}</span>
              </p>
            </div>
          </div> */}

          {/* Client Name Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-400 dark:bg-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 dark:ring-purple-500 dark:bg-purple-400  rounded-xl p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-purple-600 dark:text-purple-600 mb-1 sm:mb-2 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-sm sm:text-base">Client Name</span>
              </div>
              <p className="text-gray-700 dark:text-white font-medium text-sm sm:text-base truncate">
                <span className="sm:hidden">{getFirstName(clientName)}</span>
                <span className="hidden sm:block">{clientName}</span>
              </p>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-400 dark:bg-amber-200 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 dark:ring-amber-500 dark:bg-amber-400 rounded-xl p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-amber-600 dark:text-amber-600 mb-1 sm:mb-2 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm sm:text-base">Balance</span>
              </div>
              <p className="text-gray-700 dark:text-white font-medium text-sm sm:text-base">{Math.abs(outstandingBalance).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;