import React from "react";
import HotelCard from "./Helper/HotelCard";

const Hotels = () => {
  return (
    <div className="pt-[5rem] bg-gray-200 pb-[4rem] ">
      <h1 className="heading">Best Hotel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3rem] items-center w-[80%] mx-auto mt-[4rem]">
        <div data-aos="fade-left">
          <HotelCard
            name="hotel Nextus"
            city="Rajshahi"
            price="$123"
            reviewNum="21"
            image="/images/h1.png"
          />
        </div>
        <div data-aos="zoom-in" data-aos-delay="300">
          <HotelCard
            name="hotel Reactive"
            city="Dhaka"
            price="$223"
            reviewNum="31"
            image="/images/h2.png"
          />
        </div>
        <div data-aos="fade-right" data-aos-delay="600">
          <HotelCard
            name="hotel TypeScript"
            city="Japan"
            price="$423"
            reviewNum="51"
            image="/images/h3.png"
          />
        </div>
        <div data-aos="fade-left" data-aos-delay="900">
          <HotelCard
            name="hotel Mongohouse"
            city="England"
            price="$523"
            reviewNum="81"
            image="/images/h4.png"
          />
        </div>
        <div data-aos="zoom-in" data-aos-delay="1200">
          <HotelCard
            name="hotel tailwind"
            city="India"
            price="$323"
            reviewNum="34"
            image="/images/h5.png"
          />
        </div>
        <div data-aos="fade-right" data-aos-delay="1600">
          <HotelCard
            name="hotel Webdev"
            city="USA"
            price="$723"
            reviewNum="291"
            image="/images/h6.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Hotels;
