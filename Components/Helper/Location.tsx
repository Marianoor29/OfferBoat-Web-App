import React, { useState } from "react";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";

interface LocationProps {
  onAddressSelect: (address: string) => void;
  placeholder?: string;
}

const Location = ({ onAddressSelect, placeholder = "Please select your location" }: LocationProps) => {
  const handleSelect = (value: any) => {
    const selectedAddress = value.label; // Extract the selected address
    onAddressSelect(selectedAddress); // Pass it to the parent component
  };

  return (
    <div className="flex items-center p-4 border rounded-lg cursor-pointer">
      <div className="w-full">
        <GooglePlacesAutocomplete
          apiKey="AIzaSyDiY4TiKIhXraPLCfY898nYjMpxxQ3Gxig"
          selectProps={{
            placeholder: placeholder,
            onChange: handleSelect, // Callback when an address is selected
            className: "outline-none w-full rounded-md",
          }}
          autocompletionRequest={{
            types: ["(cities)"], // Restrict results to cities
          }}
        />
      </div>
    </div>
  );
};

export default Location;
