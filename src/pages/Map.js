import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";

// Custom waste bin icon for map
const wasteBinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/929/929430.png", // Bin icon URL
  iconSize: [30, 30],
});

const Map = () => {
  const [bins, setBins] = useState([]); // State for storing bins
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/map/bins"); // Full URL for the API
        if (!response.ok) {
          throw new Error("Failed to fetch bins");
        }
        const data = await response.json();
        setBins(data); // Set bins data
      } catch (error) {
        setError(error.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBins();
  }, []);

  // Function to open Google Maps with the bin location
  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
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
              icon={wasteBinIcon}
            >
              <Popup>
                <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <strong style={{ fontSize: "16px", color: "#333" }}>
                    Bin Details
                  </strong>
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
                        <td>{bin.humidity}%</td> {/* Added humidity display */}
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openGoogleMaps(
                          bin.binLocation.latitude,
                          bin.binLocation.longitude
                        )
                      }
                    >
                      Location
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
