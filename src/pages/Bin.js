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
    newBins[index].collected = !newBins[index].collected;
    setBins(newBins);
  };

  return (
    <div className="bin-container">
      <h2>Bin Information</h2>
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
            <tr key={bin.id}>
              <td>{bin.id}</td>
              <td>{bin.full}</td>
              <td>{bin.fullPercentage}%</td>
              <td>{bin.temperature}°C</td>
              <td>
                <input
                  type="checkbox"
                  checked={bin.collected}
                  onChange={() => handleCheckboxChange(index)}
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
