'use client';
import WelcomeCard from "@/Components/Helper/WelcomeCard";
import { UserContext } from "@/context/UserContext";
import { Moment } from 'moment';
import { useSearchParams, useRouter} from 'next/navigation'; 
import { useContext, useEffect, useState } from "react";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SuccessModal from "@/Components/Helper/SuccessModel";


interface Package {
  hours: number;
  price: string;
}

interface Offer {
  _id: string;
  packages: Package[];
  title: string;
  description: string;
  numberOfPassengers: number;
  location: string;
  ownerId: any;

}

// Load Stripe (publishable key)
const stripePromise = loadStripe("pk_live_51OmnJVGd0YHQCab54RHORWLcVVFe6fnqoTER5Mg34BbAR9kkCDjXk7jrbEqKVr3AmLw1wV0p0vw7lxpNXUzXq06J000xsmRtwX");

const Booking = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const offer = searchParams.get('offer'); 
  const [BoatDetail, setBoatDetail] = useState<Offer | null>(null);
  const { user } = useContext(UserContext)!;
  const [date, setDate] = useState<Moment | undefined>(undefined);
  const [time, setTime] = useState<Moment | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
useEffect(() => {
  if (offer) {
    try {
      const safeOffer = decodeURIComponent(offer as string);
      const parsedOffer = JSON.parse(safeOffer);
      setBoatDetail(parsedOffer);
    } catch (error) {
      console.error("Error parsing offer:", error, "Original offer:", offer);
    }
  }
}, [offer]);


  const validateForm = () => {
    if (!date || !time || !selectedPackage) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handlePayment = async (stripe: any, elements: any) => {
    if (!selectedPackage) {
      alert('No package selected!');
      return;
    }

    const priceInDollars = parseFloat(selectedPackage.price.replace(/[^0-9.-]+/g, ""));
    const amountInCents = Math.round(priceInDollars * 100 * 0.10); // Convert to 10% amount

    setIsProcessing(true);
    try {
      // Fetch payment intent from your backend
      const response = await fetch(`https://www.offerboats.com/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountInCents, userId: user._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent.');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      if (!stripe || !elements) {
        alert('Stripe has not loaded yet. Please try again later.');
        return;
      }
      const cardElement = elements.getElement(CardElement);


      if (!cardElement) {
        alert('Card element not loaded. Please try again.');
        return;
      }
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.firstName || 'Guest',
            email: user.email,
          }
        }
      });

      if (error) {
        alert(error.message);
        return;
      }

      await handleSubmit(paymentIntentId);
    } catch (error: any) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (paymentIntentId: string) => {
    const bookingData = {
      userId: user._id,
      listingId: BoatDetail?._id,
      ownerId: BoatDetail?.ownerId?._id,
      date: date?.format('DD-MM-YYYY'),
      time: time?.format('hh:mm A'),
      package: selectedPackage,
      numberOfPassenger: BoatDetail?.numberOfPassengers,
      location: BoatDetail?.location,
      status: 'Pending',
      paymentIntentId,
    };

    try {
      const response = await fetch(`https://www.offerboats.com/bookingRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
      setIsModalOpen(true);
      router.push(`/trips`);
      } else {
        alert('Failed to send booking request. Please try again.');
      }
    } catch (error: any) {
      alert('Failed to send booking request. Please try again.');
    }
  };

  return (
    <>
      {user.token ? (
        user.userType === "BoatRenter" ? (
          <Elements stripe={stripePromise}>
            <BookingContent
              BoatDetail={BoatDetail}
              validateForm={validateForm}
              handlePayment={handlePayment}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              errorMessage={errorMessage}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              isProcessing={isProcessing}
              showCardDetails={showCardDetails}
              setShowCardDetails={setShowCardDetails}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </Elements>
        ) : (
          <WelcomeCard title="Please create a renter account to book this boat" />
        )
      ) : (
        <WelcomeCard />
      )}
    </>
  );
};

const BookingContent = ({
  BoatDetail,
  validateForm,
  handlePayment,
  date,
  setDate,
  time,
  setTime,
  errorMessage,
  selectedPackage,
  setSelectedPackage,
  isProcessing,
  showCardDetails,
  setShowCardDetails,
  isModalOpen,
  setIsModalOpen,
}: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleBookNow = () => {
    if (validateForm()) {
      setShowCardDetails(true); 
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
        <h1 className="heading mb-5">Send Booking Request</h1>
        {BoatDetail ? (
          <>
            <div className="mb-7">
              <h1 className="mb-2">Date</h1>
              <Datetime
                value={date || undefined}
                onChange={(date) => setDate(date as Moment)}
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                closeOnSelect={true}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="mb-7">
              <h1 className="mb-2">Time</h1>
              <Datetime
                value={time || undefined}
                onChange={(time) => setTime(time as Moment)}
                dateFormat={false}
                timeFormat="hh:mm A" // Use 12-hour format with AM/PM
                closeOnSelect={true}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="mb-7">
              <h1 className="mb-2">Select Package</h1>
              {BoatDetail?.packages.map((item: any, index: any) => (
                <div
                  key={index}
                  onClick={() => setSelectedPackage(item)}
                  className={`w-full m-1 px-4 py-2 text-sm font-medium rounded-lg border transition 
                    ${selectedPackage === item
                      ? "bg-renterBlue50 text-gray-700 border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {item.hours} Hours - {item.price}
                </div>
              ))}
              {selectedPackage && (
                <div className="mt-4 text-sm text-gray-700">
                  Selected Package: {selectedPackage.hours} Hours, {selectedPackage.price}
                </div>
              )}
            </div>
            <p className="mb-7 text-red-600 text-center">{errorMessage}</p>
          
         {/* Book Now Button */}
         {!showCardDetails && (
              <button
                onClick={handleBookNow}
                className={`mb-7 p-4 bg-renterBlue text-white rounded-md hover:bg-cyan-700 focus:outline-none`}
              >
                Book Now
              </button>
            )}
              {/* Card Details Section */}
              {showCardDetails && (
              <>
                <div className="mb-7">
                  <h1 className="mb-2">Card Details</h1>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handlePayment(stripe, elements)}
                  className={`mb-7 p-4 ${
                    isProcessing ? "bg-gray-400" : "bg-renterBlue"
                  } text-white rounded-md hover:bg-cyan-700 focus:outline-none`}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </>
            )}

            <p className="mb-7 text-gray-500 text-left">
              By booking now you will be charged a 10% non-refundable booking fee. The full price of your trip must be paid directly to the boat owner.
            </p>
          </>
        ) : (
          <p>Loading boat details...</p>
        )}
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Booking request sent successfully!"
      >
        <p className="text-gray-700">
        You will be contacted shortly, check your trips tab for more update.
        </p>
      </SuccessModal>
    </div>
  );
};

export default Booking;