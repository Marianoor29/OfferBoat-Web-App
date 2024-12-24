'use client';
import CurrencyInput from "@/Components/Helper/CurrencyInput";
import HourSelector from "@/Components/Helper/HourSelector";
import SuccessModal from "@/Components/Helper/SuccessModel";
import WelcomeCard from "@/Components/Helper/WelcomeCard";
import { UserContext } from "@/context/UserContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Moment } from 'moment';
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

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

// Google Geocoding API base URL
const GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json';

// Utility function to get city and country from Google API
async function getCityAndCountryFromGoogle(location: string) {
  const apiKey = 'AIzaSyDiY4TiKIhXraPLCfY898nYjMpxxQ3Gxig';
  const url = `${GOOGLE_GEOCODING_API}?address=${encodeURIComponent(location)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const addressComponents = data.results[0].address_components;
      let city = '';

      addressComponents.forEach((component: {
        short_name: string; types: string | string[]; long_name: string;
      }) => {
        if (component.types.includes('postal_town')) {
          city = component.long_name;
        }
        else if (!city && component.types.includes('locality')) {
          city = component.long_name;
        }
      });
      return city || 'USA';

    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Load Stripe (publishable key)
const stripePromise = loadStripe("pk_live_51OmnJVGd0YHQCab54RHORWLcVVFe6fnqoTER5Mg34BbAR9kkCDjXk7jrbEqKVr3AmLw1wV0p0vw7lxpNXUzXq06J000xsmRtwX");

const MakeOffer = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const offer = searchParams.get('offer'); 
  const [instruction, setInstruction] = useState<string>('')
  const [numberOfPassenger, setNumberOfPassenger] = useState<number>(0);
  const [BoatDetail, setBoatDetail] = useState<Offer | null>(null);
  const [price, setPrice] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<Moment | undefined>(undefined);
  const [time, setTime] = useState<Moment | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captainSelected, setCaptainSelected] = useState(false);
  const [offerLocation, setOfferLocation] = useState('');
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UserContext)!;

  useEffect(() => {
    if (offer) {
      try {
        const parsedOffer = JSON.parse(decodeURIComponent(offer as string));
        setBoatDetail(parsedOffer);
        setLocation(parsedOffer.location)
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [offer]);

  useEffect(() => {
    async function fetchLocation() {
      const cityCountry = await getCityAndCountryFromGoogle(location);
      if (cityCountry) {
        setOfferLocation(cityCountry);
      }
    }

    fetchLocation();
  }, [location]);

  const decreaseMembers = () => {
    if (numberOfPassenger > 0) {
      setNumberOfPassenger(numberOfPassenger - 1);
    }
  };
  // Validation function to check if all required fields are filled and images are within limit
  const validateForm = () => {
    if (
      !offerLocation ||
      numberOfPassenger <= 0 ||
      !price ||
      !hours ||
      !date ||
      !time
    ) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handlePayment = async (stripe: any, elements: any) => {
    if (!validateForm) {
      alert('No package selected!');
      return;
    }

    const priceInDollars = parseFloat(price.replace(/[^0-9.-]+/g, ""));
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
  // Handle form submission (validate and show errors if necessary)
  const handleSubmit = async (paymentIntentId: string) => {
    if (!validateForm()) {
      return;
    }

    const requestBody: any = {
      userId: user._id,
      listingId: BoatDetail?._id,
      ownerId: BoatDetail?.ownerId?._id,
      date: date?.format('DD-MM-YYYY'),
      time: time?.format('hh:mm A'),
      packages: { price: price, hours: hours },
      numberOfPassenger,
      location: offerLocation,
      captain: captainSelected,
      paymentIntentId,
    };

    // Conditionally add tripInstructions if it's not empty
    if (instruction && instruction.trim() !== '') {
      requestBody.tripInstructions = instruction; // Add tripInstructions only if it's not empty
    }

    try {
      const response = await fetch(`https://www.offerboats.com/createListOffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        await response.json();
        setIsModalOpen(true);
        router.push(`/trips`);
      } else {
        setErrorMessage('Failed to create offer, please try again');
      }
    } catch (error) {
      setErrorMessage('Failed to create offer, please try again');
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
              instruction={instruction}
              setInstruction={setInstruction}
              price={price}
              setPrice={setPrice}
              hours={hours}
              setHours={setHours}
              captainSelected={captainSelected}
              setCaptainSelected={setCaptainSelected}
              numberOfPassenger={numberOfPassenger}
              setNumberOfPassenger={setNumberOfPassenger}
              errorMessage={errorMessage}
              isProcessing={isProcessing}
              showCardDetails={showCardDetails}
              setShowCardDetails={setShowCardDetails}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              decreaseMembers={decreaseMembers}
            />
          </Elements>
        ) : (
          <WelcomeCard title='Please create a renter account to make an offer' />
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
  instruction,
  setInstruction,
  price,
  setPrice,
  hours,
  setHours,
  captainSelected,
  setCaptainSelected,
  numberOfPassenger,
  setNumberOfPassenger,
  errorMessage,
  isProcessing,
  showCardDetails,
  setShowCardDetails,
  isModalOpen,
  setIsModalOpen,
  decreaseMembers,
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
        <h1 className="heading mb-5">Send a Custom Offer</h1>
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
          <h1 className="mb-2">Enter Trip Instructions</h1>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Enter detailed instructions for your trip, including any special requests or preferences."
            rows={5}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
        <div className="mb-7">
          <h1 className="mb-2">Add Your Budget</h1>
          <CurrencyInput
            value={price}
            onValueChange={(value) => setPrice(value)}
          />
        </div>
        <div className="mb-7">
          <h1 className="mb-2">Hours</h1>
          <HourSelector
            hours={["2", "3", "4", "6", "8", "10"]}
            onSelect={(hours) => setHours(hours)}
            selectedHours={hours}
          />
        </div>
        <div className="flex items-center justify-center space-x-12 mb-7">
          <button
            onClick={() => setCaptainSelected(true)}
            className={`w-full py-2 text-sm font-medium rounded-lg border transition 
          ${captainSelected === true
                ? "bg-renterBlue50 text-gray-700 border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`} >
            Captained
          </button>
          <button
            onClick={() => setCaptainSelected(false)}
            className={`w-full py-2 text-sm font-medium rounded-lg border transition 
          ${captainSelected === false
                ? "bg-renterBlue50 text-gray-700 border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`} >
            No Captain
          </button>
        </div>
        <div className="flex items-center justify-center space-x-12 mb-7">
          {/* Minus Button */}
          <button
            onClick={decreaseMembers}
            className="py-3 px-10 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            aria-label="Decrease Members"
          >
            <MinusIcon className="w-5" />
          </button>

          {/* Number of Passengers */}
          <p className="text-lg font-semibold">{numberOfPassenger} Passengers</p>

          {/* Plus Button */}
          <button
            onClick={() => setNumberOfPassenger(numberOfPassenger + 1)}
            className="py-3 px-10 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            aria-label="Increase Members"
          >
            <PlusIcon className="w-5" />
          </button>
        </div>
        <p className="mb-7 text-red-600 text-center"> {errorMessage}</p>
        {/* SEND Offer Button */}
        {!showCardDetails && (
          <button
            onClick={handleBookNow}
            className={`mb-7 p-4 bg-renterBlue text-white rounded-md hover:bg-cyan-700 focus:outline-none`}
          >
            Send Offer
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
              className={`mb-7 p-4 ${isProcessing ? "bg-gray-400" : "bg-renterBlue"
                } text-white rounded-md hover:bg-cyan-700 focus:outline-none`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </>
        )}
        <p className="mb-7 text-gray-500 text-left">
          If a boat owner accepts your custom offer, Offerboat will apply a 10% booking fee. Please note that the full payment for your trip must be made directly to the boat owner.
        </p>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Offer request sent successfully!"
      >
        <p className="text-gray-700">
          Your offer is has been send, check your trips tab for updates.        </p>
      </SuccessModal>
    </div>
  )
}

export default MakeOffer;