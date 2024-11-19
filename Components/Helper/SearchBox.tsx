import { CalendarDaysIcon, MapIcon } from "@heroicons/react/16/solid";
import React from "react";

type PhotosSliderProps = {
  date: boolean;
};

const SearchBox = ({date = true}) => {
  return (
    <div className="bg-white rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 items-center gap-[2rem] mt-[3rem] w-[80%]">
      {/* First search input */}
      <div className="flex items-center space-x-6 w-full">
        <MapIcon className="w-[2.5rem] h-[2.5rem] text-blue-900" />
        <div className="w-full">
          <p className="text-[18px] font-semibold mb-[0.2rem]">Location</p>
          <input
            className="outline-none border-b-2 border-blue-900 w-full py-2 px-4 rounded-md"
            type="text"
            placeholder="Where would you like to sail?"
          />
        </div>
      </div>
      {date && (
        <div className="flex items-center space-x-6 w-full">
      <CalendarDaysIcon className="w-[2.5rem] h-[2.5rem] text-blue-900" />
      <div className="w-full">
        <p className="text-[18px] font-semibold mb-[0.2rem]">Date</p>
        <input
          className="outline-none border-b-2 border-blue-900 w-full py-2 px-4 rounded-md"
          type="date"
        />
      </div>
    </div>
  )
}
   
  </div >
  
  );
};

export default SearchBox;
