import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the required elements for the Line chart
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const TransactionDetails = () => {
  const data = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Transactions",
        data: [200, 400, 300, 500, 600, 400, 800],
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3, // Smooth lines
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for allowing container control
  };

  return (
    <div>
      <h3 className="text-base sm:text-xl font-semibold dark:text-white  text-gray-800 mb-4">
        Transaction Details
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-gray-50 dark:bg-gray-600 p-2 sm:p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="text-[10px] dark:text-white sm:text-xs text-gray-500">
                Transaction ID
              </p>
              <p className="text-xs sm:text-sm dark:text-white font-medium text-gray-800">
                #123456
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs dark:text-white text-gray-500">
                Date
              </p>
              <p className="text-xs sm:text-sm dark:text-white font-medium text-gray-800">
                2023-12-01
              </p>
            </div>
            <div>
              <p className="text-[10px] dark:text-white sm:text-xs text-gray-500">
                Amount
              </p>
              <p className="text-xs sm:text-sm font-medium text-green-600">
                $1,000
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs dark:text-white text-gray-500">
                Status
              </p>
              <p className="text-xs sm:text-sm font-medium text-blue-600">
                Completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
