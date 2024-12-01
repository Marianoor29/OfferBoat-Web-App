import React, { useState } from "react";
import SearchBox from "./Helper/SearchBox";
import LocationSearchBox from "./Helper/LocationSearch";
import Image from "next/image";

interface Props {
  setAddress?: (address: string) => void;
  handleSearch?: () => void;
}

const Hero = ({ setAddress, handleSearch }: Props) => {

  return (
    <div className="w-[100%] h-[96vh] relative">
      <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-blue-800 opacity-40 z-10"></div>
      <video
        src="/images/hero.mp4"
        autoPlay
        muted
        loop
        preload="metadata"
        className="w-[100%] h-[100%] object-fill hidden lg:block"
      />
        {/* Image for small and medium screens */}
        <Image
        src="/images/a8.jpeg"
        alt="Offerboat - Boat Rentals & Yacht Charters"
        className="w-[100%] h-[100%] object-fill block lg:hidden"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute z-[100] w-[100%] h-[100%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
        <div className="flex items-center justify-center flex-col w-[100%] h-[100%]">
          <div data-aos="fade-right">
            <h1 className="heading text-white">
              YOUR BUDGET, OUR BOATS
            </h1>
            <p className="md:text-[16px] text-center text-[18px] text-white font-normal [word-spacing:5px] font-serif">
              Wherever you go, the perfect yacht awaits. Start your adventure today.
            </p>
          </div>
          <div className="mt-8 w-full flex justify-center">
            <LocationSearchBox
              setAddress={setAddress}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
