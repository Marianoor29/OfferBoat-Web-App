import { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";

interface LocationProps {
  onAddressSelect: (address: string) => void;
}

const Location = ({ onAddressSelect }: LocationProps) => {
  const [address, setLocalAddress] = useState("");

  const handleChange = (value: string) => {
    setLocalAddress(value);
  };

  const handleSelect = (address: string) => {
    setLocalAddress(address); 
    onAddressSelect(address); 
  };

  return (
      <div className="flex items-center p-4 border rounded-lg cursor-pointer">
        <div className="w-full">
          <PlacesAutocomplete
            value={address}
            onChange={handleChange} 
            onSelect={handleSelect}
            searchOptions={{
              types: ["(cities)"],
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="relative">
                <input
                  {...getInputProps({
                    placeholder: "Please select your location",
                    className: "outline-none w-full rounded-md",
                  })}
                />
                <div className="absolute top-full left-0 right-0 shadow-lg z-50 rounded-md">
                  {loading && <div className="p-2">Loading...</div>}
                  {suggestions
                    .filter((suggestion) => {
                      return (
                        suggestion.types.includes("locality") || 
                        suggestion.types.includes("administrative_area_level_1")
                      );
                    })
                    .map((suggestion, index) => {
                      const className = suggestion.active
                        ? "bg-blue-100 cursor-pointer p-2"
                        : "bg-white cursor-pointer p-2";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                          key={index}
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      </div>
  );
};

export default Location;
