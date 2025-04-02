import React, { useState, useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultData = {
  labels: ["Books", "Clients"],
  datasets: [{
    data: [0, 0],
    backgroundColor: [
      "rgba(54, 162, 235, 0.8)",
      "rgba(75, 192, 192, 0.8)",
    ],
    borderColor: [
      "rgba(54, 162, 235, 1)",
      "rgba(75, 192, 192, 1)",
    ],
    borderWidth: 2,
    hoverOffset: 4
  }]
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
      position: "bottom",
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
  }
};

const PieChart = () => {
  const [chartData, setChartData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isFetched.current) return;
      isFetched.current = true;
      
      try {
        const [booksResponse, clientsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        const booksCount = booksResponse.data?.books?.length || 0;
        const clientsCount = clientsResponse.data?.data?.length || 0;

        setChartData({
          ...defaultData,
          datasets: [{
            ...defaultData.datasets[0],
            data: [booksCount, clientsCount],
          }]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[200px] sm:h-[300px]">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;
