'use client';
import Rating from "@/Components/Helper/Rating";
import SuccessModal from "@/Components/Helper/SuccessModel";
import { ORDER_STATUSES } from "@/Components/Helper/TripOrders";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchParams, } from 'next/navigation'; 
import { useContext, useEffect, useState } from "react";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";

type Trips = {
  tripInstructions: any;
  numberOfPassenger: number;
  paymentIntentId: string;
  _id: string;
  date: string;
  createdAt: string;
  time: string;
  status: string;
  location: string;
  userId: {
    _id: any;
    firstName: string;
    lastName: string;
    profilePicture: string;
    location: string;
    rating: number;
  };
  listingId: {
    message: string;
    _id: string;
    location: string;
    title: string;
    images: string[]
  };
  ownerId: {
    _id: any;
    phoneNumber: number;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    rating: number;
    location: string;
  };
  packages: {
    hours: number;
    price: string;
  }[];
}

const TripDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const booking = searchParams.get('booking'); 
  const [tripDetails, setDetails] = useState<Trips | null>(null);
  const [bookingStatus, setBookingStatus] = useState(tripDetails?.status || 'Accepted');
  const { user } = useContext(UserContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, onRatingChange] = useState<number>(0);
  const [existingReview, setExistingReview] = useState<any>(null);

console.log(booking, 'booking')
  const handleBadgeText =
    bookingStatus === ORDER_STATUSES.PENDING
      ? "text-red-500"
      : bookingStatus === ORDER_STATUSES.CONFIRMED
        ? "text-green-500"
        : bookingStatus === ORDER_STATUSES.COMPLETED
          ? "text-teal-500"
          : bookingStatus === ORDER_STATUSES.CANCELLED
            ? "text-red-600"
            : "text-gray-500";

  useEffect(() => {
    if (booking) {
      try {
        const parsedOffer = JSON.parse(decodeURIComponent(booking as string));
        setDetails(parsedOffer);
        setBookingStatus(parsedOffer.status)
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [booking]);


  const HandleCheckListing = (tripDetails: any) => {
    const payload = {
      ...tripDetails,
      type: "TripRequest",
    };
    router.push({
      pathname: '/boat-details',
      query: { tripDetails: encodeURIComponent(JSON.stringify(payload)) },
  });
  };

  // FUNCTIONS FOR ACCEPT AND REJECT BOOKINGS BY OWNER
  const updateBookingStatus = async (status: string, paymentIntentId: string) => {
    try {
      if (tripDetails) {
        const response = await axios.put(`https://www.offerboats.com/updateBookingStatus`, {
          bookingId: tripDetails._id,
          status,
          userId: tripDetails.userId._id,
          ownerId: tripDetails.ownerId._id,
          listingId: tripDetails.listingId._id
        });

        if (response.status === 200) {
          setBookingStatus(status);
          if (status === 'Accepted') {
            await confirmPayment(paymentIntentId); // Capture the payment if booking is accepted
          } else if (status === 'Rejected') {
            await cancelPayment(paymentIntentId); // Cancel the payment if booking is rejected
          }
        }
      } else {
        console.log('Error', 'Failed to update booking status');
      }
    } catch (error) {
      console.log('Error updating booking status:', error);
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    try {
      const response = await axios.post(`https://www.offerboats.com/payment/capture-payment`, { paymentIntentId });
    } catch (error) {
      console.log('Failed to capture payment', error);
    }
  };
  const cancelPayment = async (paymentIntentId: string) => {
    try {
      await axios.post(`https://www.offerboats.com/payment/cancel-payment`, { paymentIntentId });
    } catch (error: any) {
      console.log('Failed to cancel payment:', error.response ? error.response.data : error.message);
    }
  };

  const handleAccept = async () => {
    if (tripDetails) {
      updateBookingStatus('Accepted', tripDetails.paymentIntentId)
    }
  };

  const handleReject = async () => {
    if (tripDetails) {
      await updateBookingStatus('Rejected', tripDetails.paymentIntentId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReview("");
  };

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (bookingStatus === 'Completed') {
        try {
          const response = await axios.get(`https://www.offerboats.com/rating/getRating`, {
            params: {
              bookingId: tripDetails?._id,
              renterId: tripDetails?.userId?._id,
              ownerId: tripDetails?.ownerId?._id,
              userType: user.userType
            },
          });

          if (response.status === 200) {
            setExistingReview(response.data);
          }
        } catch {
          console.log('Error fetching existing review');
        }
      };
    }
    fetchExistingReview();
  }, [tripDetails]);

  const handleSendReview = async () => {
    try {
      const apiUrl = user?.userType === 'BoatOwner'
        ? `https://www.offerboats.com/rating/ownerLeaveRating`
        : `https://www.offerboats.com/rating/renterLeaveRating`;

      const requestBody = {
        reviewText: review,
        rating,
        renterId: tripDetails?.userId?._id,
        ownerId: tripDetails?.ownerId?._id,
        bookingId: tripDetails?._id,
        userType: user.userType
      };

      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 201) {
        setIsModalOpen(false)
        setTimeout(() => {
          setIsSuccessModalOpen(true)
        }, 600)
      } else {
        alert('Failed to submit rating and review.');
      }
    } catch (error) {
      alert('Error submitting review');
    }
  };

  return (
    <div>
      {/* images section */}
      <div>
        <div className="w-[100%] lg:h-[60vh] md:h-[50vh] h-[34vh] relative">
          <Image
            src="/images/trip.jpeg"
            alt="Boat Rentals & Yacht Charters"
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
        <div className="flex flex-col items-center w-[100%] px-10 py-10">
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
                <FaCalendarDays />
                <h3 className="text-gray-700 ml-3" >
                  {tripDetails?.date}
                </h3>
              </div>
            </div>
            <div className="flex items-center mt-5">
              <h1 className={`heading ${handleBadgeText}`}>
                {bookingStatus}
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
                    tripDetails.userId.profilePicture
                }
                  alt="Offerboat - Your Budget, Our Boats"
                  className="w-12 h-12 rounded-full"
                  width={40}
                  height={40} />
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
          <div className="bg-white shadow-xl rounded-xl w-[96%] p-4 my-10 ">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Price</h2>
              <h2 className="text-lg font-serif">{tripDetails.packages[0].price}</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Hours</h2>
              <h2 className="text-lg font-serif">{tripDetails.packages[0].hours} Hours</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Passengers</h2>
              <h2 className="text-lg font-serif">{tripDetails.numberOfPassenger}</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Time</h2>
              <h2 className="text-lg font-serif">{tripDetails.time}</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Date</h2>
              <h2 className="text-lg font-serif">{tripDetails.date}</h2>
            </div>
            {tripDetails.tripInstructions && (
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
                <h2 className="text-lg font-serif">Trip Instructions</h2>
                <h2 className="text-lg font-serif ml-10">{tripDetails.tripInstructions}</h2>
              </div>
            )}

            {tripDetails.status === "Accepted" && (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-serif">Email Address</h2>
                  <h2 className="text-lg font-serif">{tripDetails.ownerId.email}</h2>
                </div>
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-serif">Phone Number</h2>
                  <h2 className="text-lg font-serif">{tripDetails.ownerId.phoneNumber}</h2>
                </div>
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
                  {user.userType === "BoatRenter" ? (
                    <h2 className="text-lg font-serif">Check Owner's Detail</h2>
                  ) : (
                    <h2 className="text-lg font-serif">Check Renter's Detail</h2>
                  )}
                  <h2 className="text-lg font-serif">Click Here</h2>
                </div>
              </div>
            )}
          </div>
          {/* Buttons Section */}
          <div className="w-full">
            {
              user.userType === "BoatOwner" && bookingStatus === "Pending" ? (
                <div className="flex justify-between">
                  <button
                    onClick={handleAccept}
                    className="w-[50%] my-2 py-4 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-[50%] ml-5 my-2 py-4 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div></div>
              )
            }
            {tripDetails.listingId.message !== "This listing has been deleted" ? (
              <button
                onClick={() => HandleCheckListing(tripDetails)}
                className="w-full my-2 py-4 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
              >
                Check Boat Details
              </button>
            ) : (
              user.userType === "BoatOwner" ?
                <h1 className="text-red-600 text-center mt-5">'You Deleted This Listing'</h1> :
                <h1 className="text-red-600 text-center mt-5">'Boat not available'</h1>
            )
            }
            {bookingStatus === "Completed" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full my-1 py-4 bg-black50 text-white rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Leave Rating
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading trip details...</p>
      )}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {existingReview ? (
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h1 className="text-lg font-semibold mb-2">You have already submitted a review for this trip.</h1>
              <h1 className="text-md font-semibold text-center">Your Review </h1>
              <h1 className="text-sm mt-2 bg-slate-50 p-2">{existingReview.reviewText}</h1>
              {existingReview?.replies && existingReview?.replies?.length > 0 && (
                <div>
                  <h1 className="text-md font-semibold my-2 text-center">Reply on your Review </h1>
                  {existingReview?.replies.map((item: any, index: any) => (
                    <div className="bg-slate-50 p-2">
                      <h3 className="text-md font-semibold">{item.replierName}</h3>
                      <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                      <h1 className="text-sm mt-2">{item.replyText}</h1>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 mt-5 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Send Review</h2>
              <div className="mb-4">
                <h1 className="mb-2">
                  Write your review here
                </h1>
                <textarea
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4">
                <h1 className="mb-2">
                  Rating
                </h1>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) =>
                    onRatingChange(Math.min(5, Math.max(0, parseFloat(e.target.value))))
                  }
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-ownerGreen text-white rounded-lg hover:bg-emerald-500"
                  onClick={handleSendReview}
                >
                  Send Review
                </button>
              </div>
            </div>
          )}

        </div>
      )}
      {/* Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => router.push('/trips')}
        title="Review Successfully Send!"
      >
        <p className="text-gray-700">
          Thank you for sharing your experience. Your feedback is appreciated!
        </p>
      </SuccessModal>
    </div>
  )
}

export default TripDetails;