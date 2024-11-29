import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

type Destination = {
  name: string;
  image: string;
};

type SliderProps = {
  destinations: Destination[]; 
  onDestinationClick: (destinationName: string) => void; 
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1300 },
    items: 5,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1300, min: 764 },
    items: 3,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const DestinationSlider = ({ destinations, onDestinationClick }: SliderProps) => {
  return (
    <Carousel
      additionalTransfrom={0}
      arrows={true}
      autoPlay={true}
      autoPlaySpeed={2000}
      centerMode={false}
      infinite
      responsive={responsive}
      itemClass="item"
    >
      {destinations.map((destination) => (
        <div
          key={destination.name}
          onClick={() => onDestinationClick(destination.name)}
          className="cursor-pointer"
        >
          <Image
            src={destination.image}
            alt={destination.name}
            width={200}
            height={200}
            className="rounded-md mx-auto object-cover"
          />
          <h1 className="destination__h1 text-center">{destination.name}</h1>
        </div>
      ))}
    </Carousel>
  );
};

export default DestinationSlider;
