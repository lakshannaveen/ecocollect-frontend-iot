import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./analysis.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5002/api/analysis/daily") // Updated endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debugging Step 1

        // Handle case where there might be a single data point
        if (data.length === 1) {
          // Manually add a label for the single data point
          data[0].day = "Single Day Data";
        }

        // Ensure all necessary values are numbers
        const validData = data.map((item) => ({
          day: item.day, // The date will be shown in the chart
          avgTemperature: parseFloat(item.avgTemperature) || 0, // Fallback to 0 if NaN
          avgWeight: parseFloat(item.avgWeight) || 0, // Fallback to 0 if NaN
        }));

        // Setting chart data
        setChartData({
          labels: validData.map((item) => item.day),
          datasets: [
            {
              label: "Avg Temperature (°C)",
              data: validData.map((item) => item.avgTemperature),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Avg Weight (kg)",
              data: validData.map((item) => item.avgWeight),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="analysis-container">
      <h2>Daily Average Temperature & Weight</h2>
      <div className="chart-wrapper">
        {chartData ? (
          <div className="chart-container">
            <Bar
              data={chartData}
              height={400} // Set height for testing
              width={600}  // Set width for testing
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
