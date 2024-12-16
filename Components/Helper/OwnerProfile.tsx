import Image from "next/image";
import ReviewSlider from "./ReviewSlider";
import { FaStar, FaRegStar } from 'react-icons/fa';

const OwnerProfile = ({ offer , reviews, errorMessage} : any) => {

  return (
    <div className=" justify-center items-center w-full p-4 bg-white shadow-lg rounded-lg mt-10 ">
         {/* Owner Profile Box on the Right */}
      <div className="w-1/3 flex items-center mb-10">
        {/* Profile Picture */}
        <div className="flex items-center ">
          <div className="flex justify-center items-center rounded-full w-[100px] h-[100px] mx-auto ">
            <Image
              src={offer.ownerId.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="Boat Rentals & Yacht Charters"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          {/* Owner Details */}
          <div className="ml-4">
          <h1 className="heading text-[15px] text-start">Owned By</h1>
            <h2 className="text-lg font-serif">{offer.ownerId.firstName} {offer.ownerId.lastName}</h2>
            {/* Rating Stars */}
            <div>

          <div className="flex items-center mt-2">
            {/* Rating Stars using react-icons */}
            {Array.from({ length: 5 }).map((_, index) => (
              index < offer.ownerId.rating
                ? <FaStar key={index} className="text-yellow-500 h-5 w-5" />
                : <FaRegStar key={index} className="text-gray-300 h-5 w-5" />
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
    {errorMessage ? (
      <h2 className="text-md font-serif">{errorMessage}</h2>
    ) : (
      <ReviewSlider Reviews={reviews} />
    )}

    </div>
  );
};

export default OwnerProfile;
