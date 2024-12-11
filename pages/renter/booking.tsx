import WelcomeCard from "@/Components/Helper/WelcomeCard";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState, useEffect, useContext } from "react";

interface Package {
  hours: number;
  price: string;
}

interface Offer {
  packages: Package[];
  title: string;
  description: string;
}

const Booking = () => {
  const router = useRouter();
  const { offer } = router.query; 
  const [BoatDetail, setBoatDetail] = useState<Offer | null>(null);
  const { user } = useContext(UserContext)!;

  useEffect(() => {
    if (offer) {
      try {
        const parsedOffer = JSON.parse(decodeURIComponent(offer as string)); 
        setBoatDetail(parsedOffer);
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [offer]);

  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);


  const validateForm = () => {
    if (!date || !time || !selectedPackage) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Form Submitted!", { date, time, selectedPackage });
  };

  return (
    <>
    {user.token ? (
      user.userType === 'BoatRenter' ? 
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
        <h1 className="heading mb-5">Send Booking Request</h1>
        {BoatDetail ? (
          <>
            <div className="mb-7">
              <h1 className="mb-2">Date</h1>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="mb-7">
              <h1 className="mb-2">Time</h1>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
            <button
              onClick={handleSubmit}
              className="mb-7 p-4 bg-renterBlue text-white rounded-md hover:bg-cyan-700 focus:outline-none"
            >
              Book Now
            </button>
            <p className="mb-7 text-gray-500 text-left">
              By booking now you will be charged a 10% non-refundable booking fee. The full price of your trip must be paid directly to the boat owner.
            </p>
          </>
        ) : (
          <p>Loading boat details...</p>
        )}
      </div>
    </div>
      : 
      <WelcomeCard 
      title ='Please create a renter account to book this boat'
      />
    ) :
      (
        <WelcomeCard />
      )}
  </>
  );
};

export default Booking;
