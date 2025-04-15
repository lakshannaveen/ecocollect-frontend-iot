import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";
import { jsPDF } from "jspdf";

// Custom waste bin icon for map
const wasteBinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/929/929430.png", // Bin icon URL
  iconSize: [30, 30],
});

// Warning icon for moving bins
const warningIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png", // Warning icon URL
  iconSize: [25, 25],
});

const Map = () => {
  const [bins, setBins] = useState([]); // State for storing bins
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const prevBinLocations = useRef({}); // To track previous locations

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/map/bins"); // Full URL for the API
        if (!response.ok) {
          throw new Error("Failed to fetch bins");
        }
        const data = await response.json();
        
        // Check for location changes
        const movingBins = {};
        data.forEach(bin => {
          const binId = bin.binId;
          if (prevBinLocations.current[binId]) {
            const prevLoc = prevBinLocations.current[binId];
            const currLoc = bin.binLocation;
            if (prevLoc.latitude !== currLoc.latitude || prevLoc.longitude !== currLoc.longitude) {
              movingBins[binId] = true;
            }
          }
          // Update previous locations
          prevBinLocations.current[binId] = {...bin.binLocation};
        });
        
        // Mark moving bins in the data
        const updatedBins = data.map(bin => ({
          ...bin,
          isMoving: movingBins[bin.binId] || false
        }));
        
        setBins(updatedBins);
      } catch (error) {
        setError(error.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // Fetch initially and then every 10 seconds
    fetchBins();
    const interval = setInterval(fetchBins, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to open Google Maps with the bin location
  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  // Function to generate and download PDF
  const downloadPdf = (bin) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Waste Bin Details - ID: ${bin.binId}`, 15, 20);
    
    // Add details
    doc.setFontSize(12);
    let yPosition = 40;
    
    doc.text(`Bin ID: ${bin.binId}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Fullness Percentage: ${bin.fullnessPercentage}%`, 15, yPosition);
    yPosition += 10;
    doc.text(`Status: ${bin.fullnessPercentage >= 95 ? "Full" : "Not Full"}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Temperature: ${bin.temperature}°C`, 15, yPosition);
    yPosition += 10;
    doc.text(`Humidity: ${bin.humidity}%`, 15, yPosition);
    yPosition += 10;
    doc.text(`Location: Latitude ${bin.binLocation.latitude}, Longitude ${bin.binLocation.longitude}`, 15, yPosition);
    yPosition += 10;
    
    if (bin.isMoving) {
      doc.setTextColor(255, 0, 0);
      doc.text('WARNING: This bin\'s location is changing frequently!', 15, yPosition);
      doc.setTextColor(0, 0, 0);
    }
    
    // Save the PDF
    doc.save(`bin_details_${bin.binId}.pdf`);
  };

  if (loading) {
    return <div className="loading">Loading bins...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="map-page">
      <div className="map-container">
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {bins.map((bin) => (
            <Marker
              key={bin.binId}
              position={[bin.binLocation.latitude, bin.binLocation.longitude]}
              icon={bin.isMoving ? warningIcon : wasteBinIcon}
            >
              <Popup>
                <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <strong style={{ fontSize: "16px", color: "#333" }}>
                    Bin Details
                  </strong>
                  {bin.isMoving && (
                    <div style={{ 
                      color: "red",
                      fontWeight: "bold",
                      margin: "5px 0",
                      fontSize: "12px"
                    }}>
                      WARNING: This bin's location is changing frequently!
                    </div>
                  )}
                  <hr style={{ margin: "5px 0" }} />
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td><strong>Bin ID:</strong></td>
                        <td>{bin.binId}</td>
                      </tr>
                      <tr>
                        <td><strong>Percentage:</strong></td>
                        <td>{bin.fullnessPercentage}%</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td
                          style={{
                            color: bin.fullnessPercentage >= 95 ? "red" : "green",
                          }}
                        >
                          {bin.fullnessPercentage >= 95 ? "Full" : "Not Full"}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Temperature:</strong></td>
                        <td>{bin.temperature}&#8451;</td>
                      </tr>
                      <tr>
                        <td><strong>Humidity:</strong></td>
                        <td>{bin.humidity}%</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginTop: "10px",
                    gap: "10px"
                  }}>
                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1
                      }}
                      onClick={() =>
                        openGoogleMaps(
                          bin.binLocation.latitude,
                          bin.binLocation.longitude
                        )
                      }
                    >
                      View Location
                    </button>
                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1
                      }}
                      onClick={() => downloadPdf(bin)}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;