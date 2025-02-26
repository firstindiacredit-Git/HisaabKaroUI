import React from 'react';

export const TableSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Name', 'Book Name', 'You Will Get', 'You Will Give', 'Outstanding Balance'].map((header) => (
                <th key={header} className="py-3 px-4 text-left">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-auto animate-pulse"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-auto animate-pulse"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-gray-200 rounded w-24 ml-auto animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
