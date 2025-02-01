import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./analysis.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5002/api/analysis/weekly-averages") // Adjust API URL if needed
      .then((response) => response.json())
      .then((data) => {
        setChartData({
          labels: data.map((item) => item.day), // Days of the week
          datasets: [
            {
              label: "Avg Temperature (°C)",
              data: data.map((item) => item.avgTemperature),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Avg Weight (kg)",
              data: data.map((item) => item.avgWeight),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="analysis-container">
      <h2>Weekly Average Temperature & Weight</h2>
      <div className="chart-wrapper">
        {chartData ? (
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;
