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

  // Fetch bin locations from the server
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/map/bins'); // Full URL for the API
        if (!response.ok) {
          throw new Error('Failed to fetch bins');
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
  }, []); // Only run once when the component mounts

  // If loading or error, display appropriate messages
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
          center={[7.8731, 80.7718]} // Coordinates for Sri Lanka (or your default center)
          zoom={7} // Set zoom level
          style={{ height: "500px", width: "100%" }}
        >
          {/* TileLayer: Adds the map background */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render markers for each bin location */}
          {bins.map((bin) => (
            <Marker
              key={bin.binId}
              position={[
                bin.binLocation.latitude, // Latitude
                bin.binLocation.longitude, // Longitude
              ]}
              icon={wasteBinIcon} // Use the custom icon
            >
              <Popup>
                {`Bin ID: ${bin.binId}`} {/* Show binId in the popup */}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
