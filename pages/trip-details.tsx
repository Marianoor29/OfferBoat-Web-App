import Rating from "@/Components/Helper/Rating";
import { ORDER_STATUSES } from "@/Components/Helper/TripOrders";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

type Trips = {
  _id: string;
  date: string;
  createdAt: string;
  time: string;
  status: string;
  location: string;
  userId: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    location: string;
    rating: number;
  };
  listingId: {
    location: string;
    title: string;
    images: string[]
  };
  ownerId: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    rating: number;
    location: string;
  };
  packages: {
    price: number;
  }[];
}

const TripDetails = () => {
  const router = useRouter();
  const { booking } = router.query;
  const [tripDetails, setDetails] = useState<Trips | null>(null);
  const { user } = useContext(UserContext)!;

  useEffect(() => {
    if (booking) {
      try {
        const parsedOffer = JSON.parse(decodeURIComponent(booking as string));
        setDetails(parsedOffer);
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [booking]);

  const handleBadgeText =
    tripDetails?.status === ORDER_STATUSES.PENDING
      ? "text-red-500"
      : tripDetails?.status === ORDER_STATUSES.CONFIRMED
        ? "text-green-500"
        : tripDetails?.status === ORDER_STATUSES.COMPLETED
          ? "text-teal-500"
          : tripDetails?.status === ORDER_STATUSES.CANCELLED
            ? "text-red-600"
            : "text-gray-500";

  return (
    <div className="">
      {/* images section */}
      <div>
      <div className="w-[100%] lg:h-[60vh] md:h-[50vh] h-[34vh] relative">
        <Image
          src="/images/trip.jpeg"
          alt="Offerboat - Boat Rentals & Yacht Charters"
          className="w-[90%] h-[100%] object-fill "
          fill
          sizes="w-[90%] h-[100%]"
        />
        </div>
        <div className="absolute lg:bottom-52 md:bottom-72 bottom-96 left-0 w-[100%] bg-black50 z-1000 px-10 ">
        <h1 className="heading text-white text-start py-5">Trip Details</h1>
      </div>
      </div>
      {tripDetails ? (
        <div className="lg:w-[90%] md:w-[90%] w-[90%] border-b border-gray-200 px-10 py-10">
          {/* Section 1 */}
          <div className="flex w-full justify-between items-center">
            <div>
              <div className="flex items-center mt-5">
                <FaLocationDot />
                <h1 className="text-gray-700 ml-3 text-xl" >
                  {tripDetails?.location}
                </h1>
              </div>
              <div className="flex items-center mt-5">
                <FaClock />
                <h3 className="text-gray-700 ml-3" >
                  {tripDetails?.time}
                </h3>
              </div>
            </div>
            <div className="flex items-center mt-5">
              <h1 className={`heading ${handleBadgeText}`}>
                {tripDetails.status}
              </h1>
            </div>
          </div>
          {/* Section 2 */}
          <div className="flex w-full justify-between items-center py-10">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 cursor-pointer" >
                <Image src={
                  user.userType === 'BoatRenter' ?
                    tripDetails.ownerId.profilePicture :
                    tripDetails.ownerId.profilePicture
                }
                  alt="Offerboat - Your Budget, Our Boats" width={48} height={48} className="object-cover" />
              </div>
              <div>
                <p className="text-lg font-serif text-gray-800">
                  {user.userType === 'BoatRenter' ?
                    `${tripDetails.ownerId.firstName} ${tripDetails.ownerId.lastName}` :
                    `${tripDetails.userId.firstName} ${tripDetails.userId.lastName}`}
                </p>
                <p className="text-sm font-serif text-gray-800">
                  {user.userType === 'BoatRenter' ?
                    `Boat Owner` :
                    `Boat Renter`}
                </p>
              </div>
            </div>
            <Rating
              rating={
                user.userType === "BoatRenter"
                  ? tripDetails.ownerId?.rating || 0
                  : tripDetails.userId?.rating || 0
              }
            />
          </div>
          {/* Section 3 */}

        </div>
      ) : (
        <p>Loading trip details...</p>
      )}
    </div>
  )
}

export default TripDetails;