import Image from "next/image";
import { FaClock } from "react-icons/fa";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import Rating from "./Rating";

type TripOrdersProps = {
  userImage: string;
  userName?: string;
  serviceDesc?: string;
  address?: string;
  date?: string;
  onPressDecline?: () => void;
  onPressImage?: () => void;
  containerStyles?: string;
  statusView?: string;
  buttonColor?: string;
  time?: string;
  price?: string | number;
  onPressDetails?: () => void;
  onPress?: () => void;
  rating: number;
};

export const ORDER_STATUSES = {
    UPCOMING : "Upcoming",
    CANCELLED : "Rejected",
    COMPLETED : "Completed",
    CONFIRMED : "Accepted",
    PENDING : "Pending",
  }

const TripOrders = ({
  userImage,
  userName,
  address,
  date,
  onPressDecline,
  onPressDetails,
  onPressImage,
  containerStyles,
  statusView = "",
  price,
  time,
  onPress,
  rating,
  buttonColor = "bg-renterBlue",
}: TripOrdersProps) => {
  // Badge colors based on the status
  const handleBadgeBg =
    statusView === ORDER_STATUSES.PENDING
      ? "bg-red-500"
      : statusView === ORDER_STATUSES.CONFIRMED
      ? "bg-green-500"
      : statusView === ORDER_STATUSES.COMPLETED
      ? "bg-teal-500"
      : statusView === ORDER_STATUSES.CANCELLED
      ? "bg-red-600"
      : "bg-gray-500";

  return (
    <div className={`p-5 bg-white rounded-lg shadow-md ${containerStyles}`}>
      <div className="flex items-center justify-between">
      <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 cursor-pointer" onClick={onPressImage}>
            <Image src={userImage} 
            alt="Offerboat - Your Budget, Our Boats"
            className="w-12 h-12 rounded-full"
            width={40}
            height={40}/>
          </div>
          <div>
            <p className="text-lg font-serif text-gray-800">{userName}</p>
           <Rating rating={rating} />
          </div>
        </div>
        {statusView && (
          <h1 className={`p-2 rounded-md text-white text-sm ${handleBadgeBg}`}
          >
            {statusView === ORDER_STATUSES.CONFIRMED
              ? "Accepted"
              : statusView === ORDER_STATUSES.COMPLETED
              ? "Completed"
              : statusView === ORDER_STATUSES.CANCELLED
              ? "Rejected"
              : "Pending"}
          </h1>
        )}
      </div>
      
      {/* Address */}
      {address && (
        <div className="flex items-center mt-5">
         <FaLocationDot />
          <h3  className="text-gray-700 ml-3" >
          {address.length > 17 ? `${address.slice(0, 17)}...` : address}
          </h3>
        </div>
      )}

      {/* Time */}
      {time && (
        <div className="flex items-center mt-3">
          <FaClock />
          <h3  className="text-gray-700 ml-3" >
            {time}
          </h3>
        </div>
      )}

      {/* Price and Date */}
      <div className="flex items-center justify-between mt-3">
        {date && (
          <div className="flex items-center">
            <FaCalendarDays />
            <h3 className="text-gray-700 ml-3" >
              {date}
            </h3>
          </div>
        )}
        {price && (
          <h3
            color="text-blue-800"
            className="font-semibold text-xl "
          >
            {price}
          </h3>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        {statusView !== ORDER_STATUSES.COMPLETED && statusView !== ORDER_STATUSES.CANCELLED && (
          <>
            {onPressDecline && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={onPressDecline}
              >
                Cancel
            </button>
            )}
          </>
        )}

        <button
          className={`${
            buttonColor
          } text-white w-full py-2 rounded-md hover:bg-opacity-80`}
          onClick={onPressDetails}
        >
            Check Details
        </button>
      </div>
    </div>
  );
};

export default TripOrders;
