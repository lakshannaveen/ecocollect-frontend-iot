import React, { useState, useEffect } from 'react';
import './Bin.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome for icons

const Bin = () => {
  const [bins, setBins] = useState([]); // Initialize bins state as an empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [highTempBins, setHighTempBins] = useState([]); // State to hold bins with high temperature

  // Fetch bins from the backend API
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/bins'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch bins');
        }
        const data = await response.json();
        setBins(data); // Update state with the fetched data
        const highTempBinsList = data.filter(bin => bin.temperature > 50); // Filter bins with temperature over 50°C
        setHighTempBins(highTempBinsList); // Store bins with high temperature
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBins();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleCheckboxChange = async (index, binId) => {
    const newBins = [...bins];
    newBins[index].isCollected = !newBins[index].isCollected; // Toggle collected state in frontend

    // Update the collected status in the backend
    try {
      await fetch(`http://localhost:5002/api/bins/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collected: newBins[index].isCollected }),
      });
      setBins(newBins); // Update state after successful backend update
    } catch (error) {
      console.error('Error updating bin status:', error);
    }
  };

  // Function to check if the bin is over 90% full and update the status accordingly
  const checkFullness = (bin) => {
    if (bin.fullnessPercentage > 90) {
      bin.isBinFull = true; // Set bin as full
    }
    return bin.isBinFull;
  };

  const currentDate = new Date().toLocaleDateString();

  if (loading) {
    return <div className="loading">Loading bins...</div>; // Show loading message
  }

  if (error) {
    return <div className="error">Error: {error}</div>; // Show error message
  }

  return (
    <div className="bin-container">
      <h2>Bin Information</h2>
      <div className="date">{currentDate}</div>
      {highTempBins.length > 0 && (
        <div className="high-temp-warning-container">
          <h3 style={{ color: 'red' }}>Warning: The following bins have high temperatures:</h3>
          <ul>
            {highTempBins.map((bin) => (
              <li key={bin._id}>
                Bin ID: {bin.binId} - Temperature: {bin.temperature}°C
              </li>
            ))}
          </ul>
        </div>
      )}
      {bins.length === 0 ? (
        <div className="empty-data">No bins available</div>
      ) : (
        <table className="bin-table">
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Full</th>
              <th>Full Percentage</th>
              <th>Temperature</th>
              <th>Collected</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, index) => {
              checkFullness(bin); // Check and update if the bin is full
              return (
                <tr key={bin._id} className={bin.isCollected ? 'collected' : ''}>
                  <td>
                    {bin.temperature > 50 && (
                      <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                    )}
                    {bin.binId}
                  </td>
                  <td>
                    {bin.isBinFull && (
                      <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                    )}
                    {bin.isBinFull ? 'Yes' : 'No'}
                  </td>
                  <td>{bin.fullnessPercentage}%</td>
                  <td>{bin.temperature}°C</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={bin.isCollected}
                      onChange={() => handleCheckboxChange(index, bin._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bin;
