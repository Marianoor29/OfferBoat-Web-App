import React, { useState } from "react";
import Image from "next/image";
import { FaCalendar, FaClock, FaUsers } from "react-icons/fa";
import { IoLocation, IoTimer } from "react-icons/io5";
import { ImUserTie } from "react-icons/im";

interface ListCardProps {
  userImage?: string;
  renterName: string;
  date: string;
  time: string;
  tripInstructions?: string;
  hours: string;
  captain: boolean;
  passengers: number;
  location: string;
  rating: number;
  price?: string;
  buttonTitle?: string;
  buttonDisable?: boolean;
  deleteRequest?: boolean;
  status?: string;
  seeMoreTextColor?: string;
  onPress: () => void;
  onPressImage?: () => void;
  onDeletePress?: () => void;
}

const ListCard: React.FC<ListCardProps> = ({
  userImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  renterName,
  date,
  time,
  tripInstructions = "",
  hours,
  captain,
  passengers,
  location,
  rating,
  price,
  buttonTitle = "Submit",
  buttonDisable,
  deleteRequest,
  status,
  seeMoreTextColor = "text-green-500",
  onPress,
  onPressImage,
  onDeletePress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncateLength = 100;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTripInstructions = () => {
    if (tripInstructions.length > truncateLength) {
      const displayText = isExpanded ? tripInstructions : `${tripInstructions.substring(0, truncateLength)}...`;
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2">{displayText}</p>
          <button onClick={toggleExpand} className={`text-sm font-serif ${seeMoreTextColor}`}>
            {isExpanded ? "See Less" : "See More"}
          </button>
        </div>
      );
    } else {
      return <p className="text-sm text-gray-600 mb-2">{tripInstructions}</p>;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mt-3 mb-3">
      {/* User Info and Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 cursor-pointer" onClick={onPressImage}>
            <Image src={userImage} alt="Offerboat - Your Budget, Our Boats" width={48} height={48} className="object-cover" />
          </div>
          <div>
            <p className="text-lg font-serif text-gray-800">{renterName}</p>
            <p className="text-sm text-gray-500">Rating: {rating} ⭐</p>
          </div>
        </div>
        <div className="text-right">
          {status && <p className="text-sm font-serif text-red-500 mb-1">{status}</p>}
          {price && <p className="text-lg font-bold text-black">{price}</p>}
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex flex-row justify-between mt-4 ">
        <div className="flex items-center text-sm text-black w-[45%]">
          <FaCalendar className="mr-2 text-lg" />
          {date}
        </div>
        <div className="flex items-center text-sm text-black w-[45%]">
          <FaClock className="mr-2 text-lg" />
          {time}
        </div>
      </div>

      {/* Hours and Passengers */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center text-sm text-black w-[45%]">
          <IoTimer className="mr-2 text-lg" />
          {hours} hours
        </div>
        <div className="flex items-center text-sm text-black w-[45%]">
          <FaUsers className="mr-2 text-lg" />
          {passengers} passengers
        </div>
      </div>

      {/* Location and Captain */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center text-sm text-black w-[45%]">
          <IoLocation className="mr-2 text-lg" />
          {location}
        </div>
        <div className="flex items-center text-sm text-black w-[45%]">
        <ImUserTie className="mr-2 text-lg" />
          {captain ? "Captained" : "No Captain"}
        </div>
      </div>

      {/* Trip Instructions */}
      <div className="mt-4">{renderTripInstructions()}</div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col space-y-2">
        <button
          onClick={onPress}
          className={`py-2 px-4 text-white font-serif rounded-md ${
            buttonDisable ? "bg-gray-400 cursor-not-allowed" : "bg-ownerGreen hover:bg-emerald-500"
          }`}
          disabled={buttonDisable}
        >
          {buttonTitle}
        </button>
        {deleteRequest && (
          <button
            onClick={onDeletePress}
            className="py-2 px-4 text-white font-serif bg-red-600 hover:bg-red-700 rounded-md"
          >
            Delete Request
          </button>
        )}
      </div>
    </div>
  );
};

export default ListCard;
