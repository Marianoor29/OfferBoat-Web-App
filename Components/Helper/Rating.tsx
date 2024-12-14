import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

type RatingProps = {
  rating: number; // User's rating, should be between 0 and 5
};

const Rating: React.FC<RatingProps> = ({ rating }) => {
  // Ensure rating is capped between 0 and 5
  const validRating = Math.min(Math.max(rating, 0), 5);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <span key={index} className="text-yellow-400 text-xl">
          {index < validRating ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </div>
  );
};

export default Rating;
