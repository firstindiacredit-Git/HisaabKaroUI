import React from 'react';
import { Dropdown, Space } from 'antd';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';

const FilterControls = ({
  sortConfig,
  statusFilter,
  userFilter,
  sortItems,
  statusItems,
  userItems,
  handleSortChange,
  handleStatusFilterChange,
  handleUserFilterChange,
  clearAllFilters,
  getSortLabel,
  getStatusLabel,
  getUserLabel,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <Dropdown
          menu={{
            items: sortItems,
            selectable: true,
            defaultSelectedKeys: ['newest'],
            onSelect: ({ key }) => handleSortChange(key),
          }}
          trigger={['click']}
        >
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SortAscendingOutlined />
            <span>{getSortLabel()}</span>
          </button>
        </Dropdown>

        {/* Status Filter */}
        <Dropdown
          menu={{
            items: statusItems,
            selectable: true,
            defaultSelectedKeys: ['all'],
            onSelect: ({ key }) => handleStatusFilterChange(key),
          }}
          trigger={['click']}
        >
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FilterOutlined />
            <span>Status: {getStatusLabel()}</span>
          </button>
        </Dropdown>

        {/* User Filter */}
        <Dropdown
          menu={{
            items: userItems,
            selectable: true,
            defaultSelectedKeys: ['all'],
            onSelect: ({ key }) => handleUserFilterChange(key),
          }}
          trigger={['click']}
        >
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FilterOutlined />
            <span>User: {getUserLabel()}</span>
          </button>
        </Dropdown>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearAllFilters}
        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterControls;