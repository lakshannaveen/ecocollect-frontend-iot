import React, { useState } from 'react';
import './Bin.css';

const Bin = () => {
  const [bins, setBins] = useState([
    { id: 1, full: 'Yes', fullPercentage: 80, temperature: 25, collected: false },
    { id: 2, full: 'No', fullPercentage: 40, temperature: 22, collected: false },
    { id: 3, full: 'Yes', fullPercentage: 90, temperature: 30, collected: false },
  ]);

  const handleCheckboxChange = (index) => {
    const newBins = [...bins];
    newBins[index].collected = !newBins[index].collected; // Toggle collected state
    setBins(newBins); // Update state immediately
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="bin-container">
      <h2>Bin Information</h2>
      <div className="date">{currentDate}</div>
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
            <tr
              key={bin.id}
              className={bin.collected ? 'collected' : ''} // Apply 'collected' class if collected
            >
              <td>{bin.id}</td>
              <td>{bin.full}</td>
              <td>{bin.fullPercentage}%</td>
              <td>{bin.temperature}°C</td>
              <td>
                <input
                  type="checkbox"
                  checked={bin.collected} // Check if the bin is collected
                  onChange={() => handleCheckboxChange(index)} // Handle change
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bin;
