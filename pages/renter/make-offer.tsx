import CurrencyInput from "@/Components/Helper/CurrencyInput";
import HourSelector from "@/Components/Helper/HourSelector";
import Location from "@/Components/Helper/Location";
import WelcomeCard from "@/Components/Helper/WelcomeCard";
import { UserContext } from "@/context/UserContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { parseCookies } from "nookies";
import { useContext, useEffect, useState } from "react";

const MakeOffer = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string>('')
  const [numberOfPassenger, setNumberOfPassenger] = useState<number>(0);
  const [price, setPrice] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captainSelected, setCaptainSelected] = useState(false);
  const { user } = useContext(UserContext)!;

  const decreaseMembers = () => {
    if (numberOfPassenger > 0) {
      setNumberOfPassenger(numberOfPassenger - 1);
    }
  };

  // Validation function to check if all required fields are filled and images are within limit
  const validateForm = () => {
    if (
      !selectedAddress ||
      numberOfPassenger <= 0 ||
      !price ||
      !hours ||
      !captainSelected ||
      numberOfPassenger <= 0 ||
      !date ||
      !time
    ) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  // Handle form submission (validate and show errors if necessary)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if the form is invalid
    }

    // Proceed with form submission (you can add your submission logic here)
    console.log("Form Submitted!");
  };

  return (
    <>
      {user.token ? (
        user.userType === 'BoatRenter' ? 
        <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
          <h1 className="heading mb-5">Publish a Custom Offer</h1>
          <p>The offers published here will be public. Interested boat owners will respond by sending you details about their available boats. Check your "My Offers" tab for updates.</p>
          <div className="mb-7">
            <h1 className="mb-2">Select Your Location</h1>
            <Location onAddressSelect={(address: string) => setSelectedAddress(address)} />
          </div>
          <div className="mb-7">
            <h1 className="mb-2">Date</h1>
            <input
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-7">
            <h1 className="mb-2">Time</h1>
            <input
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
          <button
            onClick={handleSubmit}
            className="mb-7 p-4 bg-renterBlue text-white rounded-md hover:bg-cyan-700 focus:outline-none"
            disabled={!validateForm}
          >
            Publish Offer
          </button>
          <p className="mb-7 text-gray-500 text-left">
            If a boat owner accepts your custom offer, Offerboat will apply a 10% booking fee. Please note that the full payment for your trip must be made directly to the boat owner.
          </p>
        </div>
      </div>
      : 
        <WelcomeCard 
        title ='Please create a renter account to make an offer'
        />
      ) :
        (
          <WelcomeCard />
        )}
    </>
  )
}

export default MakeOffer;