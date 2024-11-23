import React, { useState } from "react";
import Link from "next/link";
import { MapIcon } from "@heroicons/react/16/solid";
import PlacesAutocomplete from "react-places-autocomplete";

// LocationSearchBox component now accepts `setAddress` and `onSearch` as props
const LocationSearchBox = ({ setAddress, onSearch }: { setAddress: (address: string) => void, onSearch: () => void }) => {
  const [address, setLocalAddress] = useState("");

  const handleChange = (value: string) => {
    setLocalAddress(value); 
  };

  const handleSearch = () => {
    setAddress(address); // Only set the address when search button is clicked
    onSearch(); // Trigger the search function passed from parent
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-[1rem] my-4 mx-6 w-[96%] justify-between">
      <div className="flex items-center space-x-6 w-full">
        <MapIcon className="w-[2.5rem] h-[2.5rem] text-blue-900" />
        <div className="w-full">
          <p className="text-[18px] font-semibold mb-[0.2rem]">Location</p>
          <PlacesAutocomplete
            value={address}
            onChange={handleChange} // Handle input change but no immediate search
            searchOptions={{
              types: ["(cities)"],
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="relative">
                <input
                  {...getInputProps({
                    placeholder: "Where would you like to sail?",
                    className: "outline-none border-b-2 border-blue-900 w-full py-2 px-4 rounded-md",
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
      <button
        onClick={handleSearch} // Handle click to trigger search
        className="relative rounded-lg lg:inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium group bg-blue-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300"
      >
        <span className="absolute w-0 h-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-t from-transparent via-transparent to-blue-900"></span>
        <span className="relative">Search</span>
      </button>
    </div>
  );
};

export default LocationSearchBox;
