import React from "react";
import DestinationSlider from "./Helper/DestinationSlider";
import { useRouter } from "next/router";

const destinations = [
  { name: "Miami", image: "/images/miami.jpg" },
  { name: "Miami Beach", image: "/images/miami-beach.jpg" },
  { name: "Tampa", image: "/images/tampa.jpg"},
  { name: "Los Angeles", image: "/images/los-angeles.jpg"},
  { name: "Seattle", image: "/images/seattle.jpg" },
  { name: "Washington D.C.", image: "/images/washington-dc.jpg" },
  { name: "San Francisco", image: "/images/san-fransisco.jpg" },
  { name: "Chicago", image: "/images/chicago.jpg"},
  { name: "New York", image: "/images/new-york.jpg" },
];

const TopDestination = () => {
  const router = useRouter();

  const handleDestinationClick = (destinationName: string) => {
    router.push(`/boats?address=${encodeURIComponent(destinationName)}`);
  };  

  return (
    <div className="mt-[2rem] mb-[2rem]">
      <h1 className="heading lg:text-[25px] md:text-[21px] text-[15px]">Discover Our Top Destinations</h1>
      <div className="mt-[2rem] w-[80%] mx-auto ">
      <DestinationSlider
        destinations={destinations}
        onDestinationClick={handleDestinationClick}
      />
      </div>
    </div>
  );
};

export default TopDestination;
