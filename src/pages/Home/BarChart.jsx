import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Credit",
      data: [300, 400, 500, 200, 100, 300, 400],
      backgroundColor: "rgba(16, 185, 129, 0.7)", // Emerald
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 2,
      borderRadius: 6,
    },
    {
      label: "Debit",
      data: [200, 300, 100, 400, 500, 100, 200],
      backgroundColor: "rgba(239, 68, 68, 0.7)", // Red
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 2,
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    }
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        font: {
          size: 11,
          weight: '500'
        },
        color: '#6B7280'
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1f2937",
      bodyColor: "#1f2937",
      padding: 10,
      bodyFont: {
        size: 11,
        weight: '400'
      },
      titleFont: {
        size: 12,
        weight: '600'
      },
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: {
          size: 10,
          weight: '400'
        },
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.06)",
        drawBorder: false
      },
      ticks: {
        font: {
          size: 10,
          weight: '400'
        },
        color: '#6B7280',
        padding: 8
      }
    }
  }
};

const BarChart = () => {
  return (
    <div className="w-full h-[200px] sm:h-[300px]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;

