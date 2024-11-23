import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

type PhotosSliderProps = {
    images: string[];
    height?: string; 
    width?: string; 
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1, 
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1, 
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1, 
  },
};

const PhotosSlider: React.FC<PhotosSliderProps> = ({ images , height = "h-64", width = 'w-full'}) => {
  return (
    <div className="w-full mx-auto">
        <Carousel
        responsive={responsive}
        infinite
        // autoPlay
        // autoPlaySpeed={3000}
        showDots={false}
        containerClass="carousel-container"
        itemClass="item"
      >
        {images.map((src, index) => (
         <div key={index} className={`${width} relative ${height}`}>
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default PhotosSlider;
