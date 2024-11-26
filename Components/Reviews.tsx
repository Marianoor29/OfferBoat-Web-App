import React from "react";
import ReviewSlider from "./Helper/ReviewSlider";

const Reviews = () => {
  return (
    <div className="pt-[3rem] pb-[3rem] ">
      <h1 className="heading text-[20px]">Genuine Reviews from Both Sides of the Boat</h1>
      <div className="mt-[4rem] w-[80%] mx-auto">
        <ReviewSlider />
      </div>
    </div>
  );
};

export default Reviews;
