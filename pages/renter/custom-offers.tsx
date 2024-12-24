'use client';
import Modal from "@/Components/Helper/ModelWrapper";
import OfferCard from "@/Components/Helper/OfferCard";
import Rating from "@/Components/Helper/Rating";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchParams,} from 'next/navigation'; 
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface BoatListing {
  _id: string;
  location: string;
  dateSent: string;
  price: string;
  description: string;
  numberOfPassengers: number;
  images: string[];
  ownerId: {
    profilePicture: string;
    firstName: string;
    lastName: string;
    rating: number;
  };
  title: string;
  tripInstructions: string;
}

type Offer = {
  _id: string;
  owner: string;
  location: string;
  title: string;
  description: string;
  price: string;
  hours: string;
  numberOfPassenger: number;
  images: string[];
  features: string[];
  rules: string[];
  boatOwnerImage?: string;
  userId: any;
  date: any;
  time: any;
  captain: boolean
};

const CustomOffers = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const offer = searchParams.get('offer'); 
  const { user } = useContext(UserContext)!;
  const [offerDetails, setDetails] = useState<Offer | null>(null);
  const [boatListing, setBoatListing] = useState<BoatListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const fetchBoatListings = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/OwnerListingOnCustomOffers/${offerDetails?._id}`);
      const boatListingsArray = Array.isArray(response.data) ? response.data : [response.data];
      setBoatListing(boatListingsArray);
    } catch (error) {
      console.log('Error fetching boat listings:', error);
    }
  };

  useEffect(() => {
    fetchBoatListings();
  }, [offerDetails?._id]);

  const deleteCustomOffer = async () => {
    try {
      await axios.delete(`https://www.offerboats.com/deleteCustomOffer/${offerDetails?._id}`
      );
      router.push(`/renter/my-offers/`);
    } catch (error) {
      console.log('Error deleting custom offer:', error);
    }
  };

  const handleOnPress = (listing: any) => {
    const payload = {
      ...listing,
      type: "BoatRequest",
    };
  
    router.push({
      pathname: '/boat-details',
      query: { tripDetails: encodeURIComponent(JSON.stringify(payload)) },
  });
  };
  
  return (
    <div className="bg-white p-6">
      {/* User Info Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 cursor-pointer">
            <Image src={user.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="Offerboat - Your Budget, Our Boats"
                className="w-12 h-12 rounded-full"
                width={40}
                height={40}/>
          </div>
          <div>
            <p className="text-lg font-serif text-gray-800">{user?.firstName} {user?.lastName}</p>
            <Rating rating={user.rating || 0} />
          </div>
        </div>
        <button className="flex items-center justify-center text-red-600 bg-black50 h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl"
          onClick={() => setIsModalOpen(true)}>
          <FaTrash />
        </button>
      </div>
      {/* Custom Offer Info Section */}
      <div className="bg-white shadow-xl rounded-xl w-full p-4 mt-10 ">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-serif">Price</h2>
          <h2 className="text-lg font-serif">{offerDetails?.price}</h2>
        </div>
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-serif">Hours</h2>
          <h2 className="text-lg font-serif">{offerDetails?.hours} Hours</h2>
        </div>
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-serif">Passengers</h2>
          <h2 className="text-lg font-serif">{offerDetails?.numberOfPassenger} </h2>
        </div>
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-serif">Time</h2>
          <h2 className="text-lg font-serif">{offerDetails?.time} </h2>
        </div>
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-lg font-serif">Captain</h2>
          <h2 className="text-lg font-serif">{offerDetails?.captain === true ? "Yes" : "No"} </h2>
        </div>
      </div>
      {/* Listing Section */}
      <div className="mt-10">
        {boatListing.length !== 0 ? (
          <p className="text-center">These boat listings are sent by owners for your consideration through your custom offers</p>
        ) : (
          <p className="text-center text-red-600">No Listing request found on this custom offer yet!</p>
        )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
          {boatListing.map((item: any) => (
              <OfferCard
                key={item._id}
                title={item.title}
                boatOwnerImage={item.ownerId?.profilePicture}
                members={item.numberOfPassengers}
                location={item.location}
                description={item.description}
                images={item?.images}
                buttonTitle="View Boat Details"
                onPress={() => handleOnPress(item)}
              />
            ))}
          </div>
      </div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Are you sure you want to delete this custom offer? "
        onConfirm={deleteCustomOffer}
      >
        <p className="text-gray-700">All the requests related to this offer, will also be deleted.</p>
      </Modal>
    </div>
  )
}

export default CustomOffers;