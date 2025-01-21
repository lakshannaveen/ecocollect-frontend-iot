import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Map.css"; // Import the CSS file

const Map = () => {
  return (
    <div className="map-page">
      <div className="map-container">
        <MapContainer
          center={[7.8731, 80.7718]} // Coordinates for Sri Lanka
          zoom={7} // Adjust zoom level for a better view of Sri Lanka
          style={{ height: "100%", width: "100%" }}
        >
          {/* TileLayer: Adds the map background from OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/5/55/Error_tile.png" // Custom fallback tile
          />

          {/* Marker: Add a marker for Colombo */}
          <Marker position={[6.9271, 79.8612]}> {/* Colombo coordinates */}
            <Popup>
              <b>Colombo</b><br />The capital city of Sri Lanka.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
