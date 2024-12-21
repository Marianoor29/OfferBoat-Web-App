import CurrencyInput from "@/Components/Helper/CurrencyInput";
import OfferCard from "@/Components/Helper/OfferCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

type Offer = {
  _id: string;
  owner: string;
  location: string;
  title: string;
  description: string;
  packages: any[];
  numberOfPassengers: number;
  images: string[];
  features: string[];
  rules: string[];
  boatOwnerImage?: string;
  userId: any;
  date: any;
  time: any;
  hours:any;

};

type Listing = {
  rules: never[];
  features: never[];
  ownerId: any;
  _id: string;
  title: string;
  location: string;
  profilePicture: string;
  description: string;
  images: string[];
  numberOfPassengers: number;
  createdAt: string;
};

const SelectListing = () => {
  const router = useRouter();
  const { offer } = router.query;
  const [offerDetails, setDetails] = useState<Offer | null>(null);
  const [boats, setBoats] = useState<Listing[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState<string>('');
  const { user } = useContext(UserContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (offer) {
      try {
        const safeOffer = decodeURIComponent(offer as string);
      const parsedOffer = JSON.parse(safeOffer);
        setDetails(parsedOffer);
      } catch (error) {
        console.error("Error parsing offer:", error);
      }
    }
  }, [offer]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(
        `https://www.offerboats.com/listing/listingsWithLocationForUser`,
        {
          params: {
            location: offerDetails?.location,
            userId: user._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setBoats(response.data.listings);
      } else {
        setErrorMessage("Failed to fetch offers");
      }
    } catch (error) {
      setErrorMessage(
        `You Don't Have Any Listings in ${offerDetails?.location}!`
      );
    }
  };

  useEffect(() => {
    if (offerDetails) {
      fetchOffers();
    }
  }, [offerDetails]);

  const handleOnAddBoats = () => {
    router.push(`/owner/add-boat`);
  };

  const openModal = (boatId: string) => {
    setSelectedBoatId(boatId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPrice("");
    setMessage("");
    setSelectedBoatId(null);
  };

  const handleSend = async () => {
    if (!price || !message || !selectedBoatId) {
      alert("Please fill in all fields.");
      return;
    }

  // Find the selected boat's details using `selectedBoatId`
  const selectedBoat = boats.find((boat) => boat._id === selectedBoatId);

  if (!selectedBoat) {
    alert("Failed to retrieve boat details. Please try again.");
    return;
  }

  const offerData = {
    ownerId: user._id,
    userId: offerDetails?.userId._id,
    listingId: selectedBoat._id,
    offerId: offerDetails?._id,
    status: "Pending",
    location: selectedBoat.location,
    title: selectedBoat.title,
    description: selectedBoat.description,
    message: message,
    numberOfPassengers: selectedBoat.numberOfPassengers,
    images: selectedBoat.images,
    features: selectedBoat.features || [],
    rules: selectedBoat.rules || [],
    packages: { price: price, hours: offerDetails?.hours },
    date: offerDetails?.date,
    time: offerDetails?.time,
  };

    try {
      const response = await fetch(
        `https://www.offerboats.com/sendOffer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offerData),
        });
        if (response.ok) {
          closeModal()
          router.push(`/owner/submitted-boats`);
        } else {
          closeModal()
          const data = await response.json();
          setErrorMessage(data.error || 'Failed to send offer, please try again');
        }
      } catch (error) {
        closeModal()
        setErrorMessage('Failed to send offer, please try again');
      }
  };

  return (
    <div className="bg-white">
      {/* Render message if no listings */}
      {boats.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-center mt-4">
            {errorMessage || `You Don't Have Any Listings in ${offerDetails?.location}!`}{" "}
          </p>
          <button
            className="bg-white text-emerald-600 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
            onClick={handleOnAddBoats}
          >
            Add Your Boats
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
          {boats?.map((item: Listing) => (
            <OfferCard
              key={item._id}
              title={item.title}
              boatOwnerImage={item.ownerId?.profilePicture}
              members={item.numberOfPassengers}
              location={item.location}
              description={item.description}
              images={item?.images}
              buttonTitle="Send"
              onPress={() => openModal(item._id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Send Listing</h2>
            <div className="mb-7">
                <h1 className="mb-2">Price</h1>
                <CurrencyInput
                  value={price}
                  onValueChange={(value) => setPrice(value)}
                />
              </div>
            <div className="mb-4">
            <h1 className="mb-2">
                Message
                </h1>
              <textarea
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
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
                onClick={handleSend}
              >
                Send Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectListing;
