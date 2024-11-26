import React, { useState } from "react";
import Image from "next/image";
import { ReviewsList } from "@/dummyData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CustomerReviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const handleNext = () => {
    setCurrentReview((prev) => (prev + 1) % ReviewsList.length);
  };

  const handlePrev = () => {
    setCurrentReview((prev) =>
      prev === 0 ? ReviewsList.length - 1 : prev - 1
    );
  };

  return (
    <section >
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Side: Large Image with Absolute Positioned Review */}
        <div className="w-full relative h-[500px]"> {/* Set relative and size the container */}
          {/* Image */}
          <Image
            src="/images/a7.jpeg"
            alt="Reviews"
            layout="fill"
            objectFit="cover" // Ensures image scales properly
            className="rounded-lg"
          />
          {/* Review Section */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-6 bg-black bg-opacity-50 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
              <div className="flex gap-2 mb-5 justify-end">
                <button
                  onClick={handlePrev}
                  className="bg-blue-900 text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronLeft size={20} color="white" />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-900 text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronRight size={20} color="white" />
                </button>
              </div>
              <p className="text-md text-black">
                {ReviewsList[currentReview].reviewText}
              </p>
              <div className="mt-6">
                <div className="flex justify-center items-center rounded-full w-[100px] h-[100px] mx-auto">
                  <Image
                    src={ReviewsList[currentReview].profilePicture}
                    alt="Customer 1"
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold">
                  {ReviewsList[currentReview].firstName}{" "}
                  {ReviewsList[currentReview].lastName}
                </h3>
                <span className="text-gray-600">
                  {ReviewsList[currentReview].userType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
