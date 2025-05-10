import React, { useState, useEffect } from 'react';
import './Bin.css';
import 'font-awesome/css/font-awesome.min.css';

const Bin = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highTempBins, setHighTempBins] = useState([]);

  // Fetch bins from the backend API
  const fetchBins = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/bins');
      if (!response.ok) {
        throw new Error('Failed to fetch bins');
      }
      const data = await response.json();
      setBins(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  useEffect(() => {
    const highTempBinsList = bins.filter(bin => bin.temperature > 50 && !bin.isCollected);
    setHighTempBins(highTempBinsList);
  }, [bins]);

  const handleCheckboxChange = async (index, binId) => {
    const newBins = [...bins];
    newBins[index].isCollected = !newBins[index].isCollected;

    try {
      const response = await fetch(`http://localhost:5002/api/bins/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collected: newBins[index].isCollected }),
      });
      if (!response.ok) throw new Error('Failed to update bin status');
      const updatedBin = await response.json();
      newBins[index] = updatedBin;
      setBins(newBins);
    } catch (error) {
      console.error('Error updating bin status:', error);
    }
  };

  const handleDeleteBin = async (binId) => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      try {
        const response = await fetch(`http://localhost:5002/api/bins/${binId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete bin');
        
        // Refresh the bin list after successful deletion
        await fetchBins();
      } catch (error) {
        console.error('Error deleting bin:', error);
        setError(error.message);
      }
    }
  };

  const isBinFull = (bin) => {
    return bin.fullnessPercentage >= 95;
  };

  const currentDate = new Date().toLocaleDateString();

  if (loading) {
    return <div className="loading">Loading bins...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
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
              <th>Humidity</th>
              <th>Collected</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, index) => (
              <tr key={bin._id} className={bin.isCollected ? 'collected' : ''}>
                <td>
                  {bin.temperature > 50 && !bin.isCollected && (
                    <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                  )}
                  {bin.binId}
                </td>
                <td>
                  {isBinFull(bin) && !bin.isCollected && (
                    <i className="fa fa-exclamation-triangle" style={{ color: 'red', marginRight: '8px' }}></i>
                  )}
                  {isBinFull(bin) ? 'Yes' : 'No'}
                </td>
                <td>{bin.fullnessPercentage}%</td>
                <td>{bin.temperature}°C</td>
                <td>{bin.humidity}%</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bin.isCollected}
                    onChange={() => handleCheckboxChange(index, bin._id)}
                  />
                </td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteBin(bin._id)}
                  >
                    <i className="fa fa-trash"></i> Delete
                  </button>
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