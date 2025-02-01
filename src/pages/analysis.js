import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./analysis.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const [dailyChartData, setDailyChartData] = useState(null);
  const [weeklyChartData, setWeeklyChartData] = useState(null);

  useEffect(() => {
    // Fetch daily data
    fetch("http://localhost:5002/api/analysis/daily") // Updated endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log("API Daily Response:", data);

        const validDailyData = data.map((item) => ({
          binId: item.binId,
          avgTemperature: parseFloat(item.avgTemperature) || 0,
          avgWeight: parseFloat(item.avgWeight) || 0,
        }));

        setDailyChartData({
          labels: validDailyData.map((item) => `Bin: ${item.binId}`),
          datasets: [
            {
              label: "Avg Temperature (°C)",
              data: validDailyData.map((item) => item.avgTemperature),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Avg Weight (kg)",
              data: validDailyData.map((item) => item.avgWeight),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching daily data:", error));

    // Fetch weekly data
    fetch("http://localhost:5002/api/analysis/weekly") // Updated endpoint for weekly data
      .then((response) => response.json())
      .then((data) => {
        console.log("API Weekly Response:", data);

        const validWeeklyData = data.map((item) => ({
          binId: item.binId,
          avgTemperature: parseFloat(item.avgTemperature) || 0,
          avgWeight: parseFloat(item.avgWeight) || 0,
        }));

        setWeeklyChartData({
          labels: validWeeklyData.map((item) => `Bin: ${item.binId}`),
          datasets: [
            {
              label: "Avg Temperature (°C)",
              data: validWeeklyData.map((item) => item.avgTemperature),
              backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
            {
              label: "Avg Weight (kg)",
              data: validWeeklyData.map((item) => item.avgWeight),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching weekly data:", error));
  }, []);

  return (
    <div className="analysis-container">
      <h2>Daily Average Temperature & Weight</h2> {/* Heading for daily chart */}
      {/* Daily Chart */}
      <div className="chart-wrapper">
        {dailyChartData ? (
          <div className="chart-container">
            <Bar
              data={dailyChartData}
              height={400}
              width={600}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const dataset =
                          tooltipItem.datasetIndex === 0
                            ? "Avg Temperature"
                            : "Avg Weight";
                        return `${dataset}: ${tooltipItem.raw} (Bin: ${tooltipItem.label})`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>Loading daily chart...</p>
        )}
      </div>

      <h2>Weekly Average Temperature & Weight</h2> {/* Heading for weekly chart */}
      {/* Weekly Chart */}
      <div className="chart-wrapper">
        {weeklyChartData ? (
          <div className="chart-container">
            <Bar
              data={weeklyChartData}
              height={400}
              width={600}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const dataset =
                          tooltipItem.datasetIndex === 0
                            ? "Avg Temperature"
                            : "Avg Weight";
                        return `${dataset}: ${tooltipItem.raw} (Bin: ${tooltipItem.label})`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>Loading weekly chart...</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;
