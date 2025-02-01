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
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBins();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Recalculate high temperature bins whenever bins or their status changes
  useEffect(() => {
    const highTempBinsList = bins.filter(bin => bin.temperature > 50 && !bin.isCollected); // Filter bins with high temperature over 50°C and not collected
    setHighTempBins(highTempBinsList); // Update highTempBins state dynamically
  }, [bins]); // This useEffect will run whenever the `bins` state changes

  const handleCheckboxChange = async (index, binId) => {
    const newBins = [...bins];
    newBins[index].isCollected = !newBins[index].isCollected; // Toggle collected state

    // Update the collected status in the backend
    try {
      const response = await fetch(`http://localhost:5002/api/bins/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collected: newBins[index].isCollected }),
      });
      if (!response.ok) throw new Error('Failed to update bin status');
      const updatedBin = await response.json();

      // After successful update, check if the bin is full
      newBins[index] = updatedBin;
      setBins(newBins); // Update the state with the new bin data
    } catch (error) {
      console.error('Error updating bin status:', error);
    }
  };

  // Function to check if the bin is over 95% full
  const isBinFull = (bin) => {
    return bin.fullnessPercentage > 95; // Only return true if fullness is strictly above 95%
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

      {/* Display high temperature bins list as a warning if there are any bins with high temperature */}
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
            {bins.map((bin, index) => (
              <tr key={bin._id} className={bin.isCollected ? 'collected' : ''}>
                <td>
                  {/* Show warning icon if temperature is above 50°C and bin is not collected */}
                  {bin.temperature > 50 && !bin.isCollected && (
                    <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                  )}
                  {bin.binId}
                </td>
                <td>
                  {/* Show warning icon if bin is over 95% full and not collected */}
                  {isBinFull(bin) && !bin.isCollected && (
                    <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                  )}
                  {isBinFull(bin) ? 'Yes' : 'No'}
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bin;
