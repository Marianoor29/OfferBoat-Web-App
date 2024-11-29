import React from "react";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { GrPowerReset } from "react-icons/gr";

type FilterBoxProps = {
  priceRange: number[];
  onPriceChange: (range: number[]) => void;
  hours: number;
  onHoursChange: (value: number) => void;
  captain: string;
  onCaptainChange: (value: string) => void;
  passengers: number;
  onPassengersChange: (value: number) => void;
  rating: number;
  onRatingChange: (value: number) => void;
  onApplyFilters: () => void;
  onRemoveFilters: () => void;
};

const FilterBox = ({
  priceRange,
  onPriceChange,
  hours,
  onHoursChange,
  captain,
  onCaptainChange,
  passengers,
  onPassengersChange,
  rating,
  onRatingChange,
  onApplyFilters,
  onRemoveFilters,
}: FilterBoxProps) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);

  const handleButtonClick = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter); 
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 w-full md:w-[96%] mx-auto mt-8">
      <div className="flex lg:flex-row md:flex-row flex-col">
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6 ">
        <button
          className="text-black rounded-md border-2 p-2"
          onClick={() => handleButtonClick("price")}
        >
          Price
        </button>
        <button
           className="text-black rounded-md border-2 p-2"
          onClick={() => handleButtonClick("hours")}
        >
          Hours
        </button>
        <button
           className="text-black rounded-md border-2 p-2"
          onClick={() => handleButtonClick("captain")}
        >
          Captain
        </button>
        <button
           className="text-black rounded-md border-2 p-2"
          onClick={() => handleButtonClick("passengers")}
        >
          Passengers
        </button>
        <button
           className="text-black rounded-md border-2 p-2"
          onClick={() => handleButtonClick("rating")}
        >
          Rating
        </button>
        </div>
         {/* Apply and Remove Filters Buttons */}
         <div className="flex space-x-4 mb-6 lg:ml-4 md:ml-2 ml-0">
        <button
          onClick={onApplyFilters}
          className="bg-blue-500 flex items-center text-white py-2 px-6 rounded-lg hover:bg-blue-600"
        >
          Apply Filters
          <HiAdjustmentsHorizontal className="ml-3"/>
        </button>
        <button
          onClick={onRemoveFilters}
          className="bg-gray-500 flex items-center just text-white py-2 px-6 rounded-lg hover:bg-gray-600"
        >
          Reset
          <GrPowerReset className="ml-3"/>
          </button>
          </div>
      </div>
      {/* Price Filter Dropdown */}
      {selectedFilter === "price" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="flex items-center mt-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                onPriceChange([parseInt(e.target.value), priceRange[1]])
              }
              min="0"
              max="2000"
              className="w-24 p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="mx-4">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([priceRange[0], parseInt(e.target.value)])
              }
              min="0"
              max="2000"
              className="w-24 p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Hours Filter Dropdown */}
      {selectedFilter === "hours" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Number of Hours
          </label>
          <input
            type="number"
            value={hours}
            onChange={(e) => onHoursChange(parseInt(e.target.value))}
            min="1"
            max="24"
            className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Captain Filter Dropdown */}
      {selectedFilter === "captain" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Captain
          </label>
          <div className="flex space-x-4 mt-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                captain === "include"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => onCaptainChange("include")}
            >
              Captain included in the boat price
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                captain === "not"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => onCaptainChange("not")}
            >
              Captain Not Include
            </button>
          </div>
        </div>
      )}

      {/* Passengers Filter Dropdown */}
      {selectedFilter === "passengers" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Number of Passengers
          </label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => onPassengersChange(parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Rating Filter Dropdown */}
      {selectedFilter === "rating" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Owner's Rating
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) =>
              onRatingChange(Math.min(5, Math.max(0, parseFloat(e.target.value))))
            }
            min="0"
            max="5"
            step="0.1"
            className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

    </div>
  );
};

export default FilterBox;
