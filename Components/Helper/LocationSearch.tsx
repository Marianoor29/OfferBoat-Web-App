import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";

interface LocationSearchBoxProps {
  setAddress: (address: string) => void;
  onSearch: () => void;
}

const LocationSearchBox = ({ setAddress, onSearch }: LocationSearchBoxProps) => {
  const [isClient, setIsClient] = useState(false);
  const [value, setValue] = useState<{ label: string; value: { place_id: string } } | null>(null);

  useEffect(() => {
    setIsClient(true); // Component is now rendering on the client
  }, []);

  const handleSearch = async () => {
    if (value) {
      setAddress(value.label); 
      onSearch(); 

      // Optional: Use `geocodeByPlaceId` to get more details like coordinates
      const results = await geocodeByPlaceId(value.value.place_id);
      const { lat, lng } = await getLatLng(results[0]);
      console.log("Coordinates:", { lat, lng });
    }
  };
  if (!isClient) return null;
  return (
    <div className="flex items-center gap-[1rem] lg:w-[50%] md:w-[50%] w-[70%] pl-5 justify-between">
      <div className="flex items-center space-x-6 w-full">
        <div className="w-full">
          <GooglePlacesAutocomplete
            apiKey="AIzaSyDiY4TiKIhXraPLCfY898nYjMpxxQ3Gxig"
            selectProps={{
              value,
              onChange: (newValue) => setValue(newValue),
              placeholder: "Where would you like to sail?",
              className: " w-full py-2 px-4 rounded-md",
            }}
            autocompletionRequest={{
              types: ["(cities)"], 
            }}
          />
        </div>
      </div>
      <button
        onClick={handleSearch} 
        className="relative rounded-lg lg:inline-flex items-center justify-center px-4 py-4 overflow-hidden font-medium group bg-renterBlue hover:opacity-70 text-white"
      >
        <IoMdSearch />
      </button>
    </div>
  );
};

export default LocationSearchBox;
