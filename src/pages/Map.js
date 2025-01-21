import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css";

// Custom waste bin icon for map
const wasteBinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/929/929430.png", // Bin icon URL
  iconSize: [30, 30],
});

const Map = () => {
  const [selectedPosition, setSelectedPosition] = useState([7.8731, 80.7718]); // Default center for Sri Lanka
  const [address, setAddress] = useState("Fetching address..."); // Display address for selected position

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      setAddress(data.display_name || "Address not found");
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Unable to fetch address");
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setSelectedPosition([lat, lng]); // Update selected position
        fetchAddress(lat, lng); // Fetch address for the new position
      },
    });
    return null;
  };

  return (
    <div className="map-page">
      <div className="map-container">
        <h3>
          Selected Location: {address}
        </h3>
        <MapContainer
          center={[7.8731, 80.7718]} // Coordinates for Sri Lanka
          zoom={7} // Adjust zoom level
          style={{ height: "500px", width: "100%" }}
        >
          {/* TileLayer: Adds the map background */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Marker: Shows the selected position */}
          <Marker position={selectedPosition} icon={wasteBinIcon}>
            <Popup>
              {address}
            </Popup>
          </Marker>

          {/* Enable location selection by clicking */}
          <LocationSelector />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
