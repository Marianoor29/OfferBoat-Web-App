import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ClientReview from "./ClientReview";
import { ReviewsList } from "@/dummyData";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1300 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1300, min: 764 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ReviewSlider = () => {
  return (
    <Carousel
      additionalTransfrom={0}
      arrows={true}
      autoPlay={true}
      autoPlaySpeed={5000}
      centerMode={false}
      infinite
      responsive={responsive}
      itemClass="item"
    >
      {ReviewsList.map((review: { profilePicture: string; firstName: string; lastName: string; userType: string; reviewText: string; }, index: React.Key | null | undefined) => (
        <ClientReview
          key={index}
          profilePicture={review.profilePicture}
          firstName={review.firstName}
          lastName={review.lastName}
          userType={review.userType}
          reviewText={review.reviewText}
        />
      ))}
    </Carousel>
  );
};

export default ReviewSlider;
