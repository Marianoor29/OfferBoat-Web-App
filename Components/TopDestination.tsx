import React from "react";
import DestinationSlider from "./Helper/DestinationSlider";

const TopDestination = () => {
  return (
    <div className="mt-[2rem] mb-[2rem] ">
      <h1 className="heading">Discover Our Top Destinations</h1>
      <div className="mt-[2rem] w-[80%] mx-auto ">
        <DestinationSlider />
      </div>
    </div>
  );
};

export default TopDestination;
