import React, { useState } from "react";
import Link from "next/link";
import { MapIcon } from "@heroicons/react/16/solid";
import PlacesAutocomplete from "react-places-autocomplete";
import { IoMdSearch } from "react-icons/io";

// LocationSearchBox component now accepts `setAddress` and `onSearch` as props
const LocationSearchBox = ({ setAddress, onSearch }: { setAddress: any, onSearch: any}) => {
  const [address, setLocalAddress] = useState("");

  const handleChange = (value: string) => {
    setLocalAddress(value); 
  };

  const handleSearch = () => {
    setAddress(address); 
    onSearch(); 
  };

  return (
    <div className="flex items-center gap-[1rem] lg:w-[50%] md:w-[50%] w-[66%] pl-5 justify-between">
      <div className="flex items-center space-x-6 w-full">
        <div className="w-full">
          <PlacesAutocomplete
            value={address}
            onChange={handleChange} 
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
        className="relative rounded-lg lg:inline-flex items-center justify-center px-4 py-4 overflow-hidden font-medium group bg-blue-900 hover:opacity-70 text-white "
      >
     <IoMdSearch />
      </button>
    </div>
  );
};

export default LocationSearchBox;
