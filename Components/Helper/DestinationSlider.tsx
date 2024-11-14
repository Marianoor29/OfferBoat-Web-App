import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const DestinationSlider = () => {
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
      <div>
        <Image
          src="/images/miami.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Miami</h1>
        <p className="destination__p">7 Boats</p>
      </div>
      <div>
        <Image
          src="/images/miami-beach.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Miami Beach</h1>
        <p className="destination__p">17 Boats</p>
      </div>
      <div>
        <Image
          src="/images/tampa.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Tampa</h1>
        <p className="destination__p">3 Boats</p>
      </div>
      <div>
        <Image
          src="/images/los-angeles.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Los Angeles</h1>
        <p className="destination__p">27 Boats</p>
      </div>
      <div>
        <Image
          src="/images/seattle.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Seattle</h1>
        <p className="destination__p">37 Boats</p>
      </div>
      <div>
        <Image
          src="/images/washington-dc.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Washington D.C.</h1>
        <p className="destination__p">23 Boats</p>
      </div>
      <div>
        <Image
          src="/images/san-fransisco.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">San Francisco</h1>
        <p className="destination__p">23 Boats</p>
      </div>
      <div>
        <Image
          src="/images/chicago.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">Chicago</h1>
        <p className="destination__p">23 Boats</p>
      </div>
      <div>
        <Image
          src="/images/new-york.jpg"
          alt="destination"
          width={200}
          height={200}
          className="rounded-md mx-auto object-cover"
        />
        <h1 className="destination__h1">New York</h1>
        <p className="destination__p">23 Boats</p>
      </div>
    </Carousel>
  );
};

export default DestinationSlider;
