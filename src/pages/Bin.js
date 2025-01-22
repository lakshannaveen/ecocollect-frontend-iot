import React, { useState, useEffect } from 'react';
import './Bin.css';

const Bin = () => {
  const [bins, setBins] = useState([]); // Initialize bins state as an empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

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
      {bins.length === 0 ? ( // Check if bins array is empty
        <div className="empty-data">No bins available</div>
      ) : (
        <table className="bin-table">
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Full</th>
              <th>Full Percentage</th>
              <th>Collected</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, index) => (
              <tr
                key={bin._id}
                className={bin.isCollected ? 'collected' : ''} // Apply 'collected' class if collected
              >
                <td>{bin.binId}</td>
                <td>{bin.isBinFull ? 'Yes' : 'No'}</td>
                <td>{bin.fullnessPercentage}%</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bin.isCollected} // Check if the bin is collected
                    onChange={() => handleCheckboxChange(index, bin._id)} // Handle change
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
