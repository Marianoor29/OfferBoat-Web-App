import FeaturesSection from '@/Components/Helper/FeaturesBox';
import Modal from '@/Components/Helper/ModelWrapper';
import OwnerProfile from '@/Components/Helper/OwnerProfile';
import PaymentModal from '@/Components/Helper/PaymentModel';
import PhotosSlider from '@/Components/Helper/PhotosSlider';
import ShareModal from '@/Components/Helper/ShareModal';
import { UserContext } from '@/context/UserContext';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { FaShare } from 'react-icons/fa';

type Listing = {
  message: string;
  _id:string;
  userId:string;
  hours: number;
  price: string;
  date: string;
  time: string;
  offerId: string;
  rules: any;
  features: any;
  location: string;
  title: string;
  description:string;
  images: string[];
  type: string;
  numberOfPassengers: number;
  numberOfPassenger: number;
  packages: any;
  ownerId:any;
  listingId : {
  _id: string;
  location: string;
  title: string;
  description: string;
  features: any;
  rules: any;
  images: string[];
  ownerId: {
    _id:string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    rating: number;
    location: string;
  };
  packages: {
    price: number;
    hours: number;
  }[]; 
}
};

// Load Stripe (publishable key)
const stripePromise = loadStripe("pk_live_51OmnJVGd0YHQCab54RHORWLcVVFe6fnqoTER5Mg34BbAR9kkCDjXk7jrbEqKVr3AmLw1wV0p0vw7lxpNXUzXq06J000xsmRtwX");

const BoatDetails = ()  => {
    const router = useRouter();
    const { tripDetails } = router.query;
    const [listingDetails, setDetails] = useState<Listing | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { user } = useContext(UserContext)!;
    const pageUrl = listingDetails?.type === "TripRequest" ? `https://www.offerboat.com/app/${listingDetails.listingId._id}` : `https://www.offerboat.com/app/${listingDetails?._id}`;
    const pageTitle =listingDetails?.type === "TripRequest" ? listingDetails.listingId.title : listingDetails?.title;

    const descriptionToShow = showFullDescription
      ? listingDetails?.listingId?.description
      : listingDetails?.listingId?.description?.slice(0, 1000);

    const descriptionToShowForRequest = showFullDescription
      ? listingDetails?.description
      : listingDetails?.description?.slice(0, 1000);

    useEffect(() => {
      if (tripDetails) {
        try {
          const parsedOffer = JSON.parse(decodeURIComponent(tripDetails as string));
          setDetails(parsedOffer);
        } catch (error) {
          console.error("Error parsing offer:", error);
        }
      }
    }, [tripDetails]);

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`https://www.offerboats.com/rating/getReviews`, {
            params: { userId: 
              listingDetails?.type === "TripRequest" ? listingDetails?.listingId?.ownerId._id : listingDetails?.ownerId._id, userType: 'BoatOwner' }
          });
  
          if (response.data.length > 0) {
            setReviews(response.data);
          } else {
            setErrorMessage('This owner has no reviews yet!')
          }
        } catch (error) {
          setErrorMessage('This owner has no reviews yet!')
        }
      };
  
      fetchReviews();
    }, [listingDetails?.type === "TripRequest" ? listingDetails?.listingId?.ownerId._id:  listingDetails?.ownerId._id]);

    const onReject = async () => {
      try {
        const response = await axios.delete(`https://www.offerboats.com/deleteOffer`, {
          params: {
            offerId: listingDetails?._id,
            userId: listingDetails?.userId,
            ownerId: listingDetails?.ownerId._id,
            listingId: listingDetails?.listingId,
            packages: listingDetails?.packages,
            location: listingDetails?.location,
            date: listingDetails?.date,
            time: listingDetails?.time,
            numberOfPassengers: listingDetails?.numberOfPassengers,
          }
        });
        if (response) {
          router.push(`/renter/my-offers`)
        }
      } catch (error) {
        alert(error)
      }
    };

    const handlePayment = async (stripe: any, elements: any, cardInfo: any) => {
      const priceInDollars = parseFloat(listingDetails?.packages[0].price.replace(/[^0-9.-]+/g, ""));
      const amountInCents = Math.round(priceInDollars * 100 * 0.10); // Convert to 10% amount
  
      setIsProcessing(true);
      try {
        // Fetch payment intent from your backend
        const response = await fetch(`https://www.offerboats.com/payment/create-payment-intent-on-listing`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amountInCents, userId: listingDetails?.userId }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create payment intent.');
        }
  
        const { clientSecret, paymentIntentId } = await response.json();
  
        if (!stripe || !elements) {
          alert('Stripe has not loaded yet. Please try again later.');
          return;
        }
  
        if (!cardInfo) {
          alert('Card element not loaded. Please try again.');
          return;
        }
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardInfo,
            billing_details: {
              name: user.firstName || 'Renter',
              email: user.email,
            }
          }
        });
  
        if (error) {
          alert(error.message);
          return;
        }
  
        await sendBookingHandler(paymentIntentId);
      } catch (error: any) {
        alert('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    const sendBookingHandler = async (paymentIntentId: string) => {
      const bookingData = {
        userId: listingDetails?.userId,
        listingId: listingDetails?.listingId,
        ownerId: listingDetails?.ownerId._id,
        date: listingDetails?.date,
        time: listingDetails?.time,
        package: listingDetails?.packages[0],
        numberOfPassenger: listingDetails?.numberOfPassengers,
        location: listingDetails?.location,
        status: 'Accepted',
        paymentIntentId: paymentIntentId,
      };
  
      try {
        // Send the booking request
        const response = await fetch(`https://www.offerboats.com/bookingRequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
  
        if (response.ok) {
          try {
            // Update the status of the offer
            const updateStatus = await axios.put(`https://www.offerboats.com/updateOwnerOfferStatus/${listingDetails?._id}`, {
              status: 'RequestAccepted',
            });
  
            if (updateStatus.status === 200) {
              try {
                // Delete the custom offer
                await axios.delete(`https://www.offerboats.com/deleteCustomOffer/${listingDetails?.offerId}`);
                router.push(`/trips`)
              } catch (error) {
                setErrorMessage('Failed to delete custom offer, please try again.');
                setTimeout(() => {
                  setErrorMessage('');
                }, 1000);
              }
            } else {
              setErrorMessage('Failed to update offer status, please try again.');
              setTimeout(() => {
                setErrorMessage('');
              }, 1000);
            }
          } catch (error) {
            setErrorMessage('Failed to update offer status, please try again.');
            setTimeout(() => {
              setErrorMessage('');
            }, 1000);
          }
        } else {
          setErrorMessage('Failed to book this trip, please try again.');
          setTimeout(() => {
            setErrorMessage('');
          }, 1000);
        }
      } catch (error) {
        setErrorMessage('Failed to book this trip, please try again.');
        setTimeout(() => {
          setErrorMessage('');
        }, 1000);
      }
    };

    const openShareModal = () => setIsShareModalOpen(true);
    const closeShareModal = () => setIsShareModalOpen(false);
  

    return (
      <Elements stripe={stripePromise}>
      <div className="pt-[1rem] p-[3rem]">
        {listingDetails ? (
          <div>
            <div className="flex relative justify-end">
              {/* PhotosSlider */}
              <PhotosSlider images={listingDetails.type === "TripRequest" ? listingDetails.listingId.images : listingDetails.images}
                height="h-[20rem] sm:h-[24rem] md:h-[28rem] lg:h-[36rem]" />
              <div className="absolute p-[1rem] ">
                <button className="flex items-center justify-center text-white bg-black50 h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl"
                   onClick={openShareModal}>
                  <FaShare />
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex flex-col lg:flex-row md:flex-row w-full relative">
              {/* Left Content */}
              <div className=" w-full relative ">
                {/* Title and Description */}
                <div className="flex mt-10 gap-6">
                  <div className="w-full lg:w-[90%] md:w-[90%] border-b border-gray-200 pb-5">
                    <h1 className="heading">{listingDetails.type === "TripRequest" ? listingDetails.listingId.title : listingDetails.title}</h1>
                    <h1 className="text-center font-thin text-gray-600 mb-5">{listingDetails.type === "TripRequest" ? listingDetails.listingId.location : listingDetails.location}</h1>
                    <p className="text-justify mb-10">
                    {listingDetails.type === "TripRequest" ? descriptionToShow : descriptionToShowForRequest}
                      {listingDetails.type === "TripRequest" ? (
                      listingDetails.listingId.description.length > 1000 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-blue-600 ml-2 hover:underline"
                        >
                          {showFullDescription ? 'See Less' : 'See More'}
                        </button>
                      ) )
                    : (
                      listingDetails.description.length > 1000 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-blue-600 ml-2 hover:underline"
                        >
                          {showFullDescription ? 'See Less' : 'See More'}
                        </button>
                    ))}
                    </p>
                    { listingDetails.message && (
                      <div className="mb-10">
                        <h1 className="font-semibold">Owner's Message</h1>
                      <p>{listingDetails.message}</p>
                      </div>
                    )}
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(listingDetails.type === "TripRequest" ? listingDetails.listingId.location : listingDetails.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2 className="text-blue-600 cursor-pointer hover:underline ">
                        Click here to view location on the map
                      </h2>
                    </a>
                  </div>
                </div>

                {/* Features and Rules */}
                <div className="w-full lg:w-[90%] md:w-[90%]">
                  <FeaturesSection features={listingDetails.type === "TripRequest" ? listingDetails.listingId.features : listingDetails.features} title='Features' />
                  <FeaturesSection features={listingDetails.type === "TripRequest" ? listingDetails.listingId.rules : listingDetails.rules} title='Things To Know' />
                </div>
                <OwnerProfile offer={listingDetails.type === "TripRequest" ? listingDetails.listingId : listingDetails} reviews={reviews} errorMessage={errorMessage} />

              </div>
              {/* Right Content */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden md:w-[50%] lg:w-[40%] p-4 mt-10 h-fit ">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">{listingDetails.packages[0].price }</h2>
              <h2 className="text-lg font-serif">{listingDetails.packages[0].hours } Hours</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Passengers</h2>
              <h2 className="text-lg font-serif">{listingDetails.type === "TripRequest" ? listingDetails.numberOfPassenger : listingDetails.numberOfPassengers}</h2>
            </div>
            { listingDetails.type !== "TripRequest" && (
              <div className="flex flex-col gap-4">
              <button
                className="rounded-lg overflow-hidden font-medium group bg-renterBlue text-center px-4 py-2"
                onClick={() => setIsModalOpen(true)}>
                <span className="text-white">Accept</span>
              </button>
              <button
                className="rounded-lg overflow-hidden font-medium group bg-red-600 text-center px-4 py-2"
                onClick={onReject}>
                <span className="text-white">Reject</span>
              </button>
            </div>
          )}
          </div>
          </div>
          </div>
        ) : (
          <p>Loading boat details...</p>
        )}
      {/* Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Are you sure you want to accept this offer?"
        handlePayment={handlePayment}
        isProcessing={isProcessing}
      >
        <p className="text-gray-700">By accepting this offer you will be charged a 10% non-refundable booking fee. The full price of your trip must be paid directly to the boat owner.</p>
      </PaymentModal>
      </div>
       {/* Share Modal */}
       <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          pageUrl={pageUrl}
          pageTitle={pageTitle || ''}
          location={listingDetails?.type === "TripRequest" ? listingDetails.listingId.location : listingDetails?.location || '' }
          src={listingDetails?.type === "TripRequest" ? listingDetails.listingId.images[0] : listingDetails?.images[0]}
        />
      </Elements>
    );
  }

  
export default BoatDetails;