const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <div
      className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700">
          {title}
        </h3>
        <div className={`p-1.5 sm:p-2 rounded-md ${color}`}>{icon}</div>
      </div>
      <p className="text-lg sm:text-2xl font-bold">{value}</p>
    </div>
  );
};

export default SummaryCard;
