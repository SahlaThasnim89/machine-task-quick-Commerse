"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 12.9716, 
  lng: 77.5946,
};

const MapPicker = ({ isOpen, onClose, onSelectLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(center);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMarkerPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => alert("Geolocation permission denied")
      );
    }
  }, []);

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg w-[90%] max-w-lg">
          <h2 className="text-lg font-semibold mb-3">Select Delivery Location</h2>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition}
              zoom={15}
              onClick={handleMapClick}
            >
              <Marker position={markerPosition} />
            </GoogleMap>
          </LoadScript>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded"
              onClick={() => onSelectLocation(markerPosition)}
            >
              Set Location
            </button>
          </div>
        </div>
      </div>
    )
  );
}; 

export default MapPicker;