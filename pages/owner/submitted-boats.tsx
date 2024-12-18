import Modal from "@/Components/Helper/ModelWrapper";
import ListCard from "@/Components/ListCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

interface Offers {
  listingId: any;
  _id: string;
  numberOfPassengers: number;
  packages: any;
  tripInstructions: string;
  price: string | undefined;
  location: string;
  numberOfPassenger: number;
  captain: boolean;
  hours: string;
  time: string;
  date: string;
  userId: any;
  offers: {
    numberOfPassenger: number;
    userId: any;
    userImage?: string;
    renterName: string;
    date: string;
    time: string;
    tripInstructions?: string;
    hours: string;
    captain: boolean;
    passengers: number;
    location: string;
    rating: number;
    price?: string;
    buttonTitle?: string;
    buttonDisable?: boolean;
    deleteRequest?: boolean;
    status?: string;
    seeMoreTextColor?: string;
    onPress: () => void;
    onPressImage?: () => void;
  }[];
  onSeeMore?: () => void;
  address: string;
  setAddress: (value: string) => void;
}

const SubmittedBoats = () => {
  const router = useRouter();
  const { user } = useContext(UserContext)!;
  const [errorMessage, setErrorMessage] = useState('');
  const [offers, setOffers] = useState<Offers[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);

  const fetchSubmittedOffers = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/getSendOffersByUser/${user._id}`);
      if (response.data.sendOffers) {
        // Sort offers by createdAt in descending order
        const sortedOffers = response.data.sendOffers.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setOffers(sortedOffers);
      } else {
        setErrorMessage('No submitted boats found.');
      }
    } catch (error) {
      setErrorMessage('No submitted boats found.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmittedOffers();
    }
  }, [user]);

  const openModal = (boatId: string) => {
    setSelectedBoatId(boatId);
    setIsModalOpen(true);
  };

  const onHandleDelete = async () => {
    const offerId = selectedBoatId; 
    try {
      const response = await axios.delete(`https://www.offerboats.com/listing/DeleteBoatRequest`, {
        data: { offerId }, 
      });    
      if (response.status === 200) {
        setIsModalOpen(false)
        router.push(`/offers`);
      }
    } catch (error) {
      console.log('Error deleting offer:', error);
    }
  };

  const handleOnPress = (listingId: any) => {
    router.push(`/owner/${listingId}`);
  }

  return (
    <div className="p-1 min-h-screen">
      <h1 className="text-center my-5">You Submitted These Boats for Renter's Consideration Through Their Custom Offers</h1>
    {offers.length === 0 ? (
      <div className="text-center text-red-500">
      {errorMessage || 'No submitted boats found.'}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto mt-[2rem]">
        {offers.map((offer, index) => (
          <ListCard
            key={index}
            userImage={offer?.userId?.profilePicture}
            renterName={`${offer?.userId?.firstName} ${offer?.userId?.lastName}`}
            date={offer?.date}
            time={offer?.time}
            hours={offer.packages[0].hours}
            captain={offer?.captain}
            status='Pending'
            passengers={offer?.numberOfPassengers}
            location={offer?.location}
            rating={offer?.userId?.rating}
            price={offer?.packages[0].price}
            tripInstructions={offer?.tripInstructions || 'no instructions provided'}
            buttonTitle={'Check Your Submitted Listing'}
            deleteRequest={true}
            onDeletePress={() => openModal(offer._id) }
            onPress={() => handleOnPress(offer.listingId)}
          />
        ))}
      </div>
    )}
     <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Are you sure you want to delete this request?"
        onConfirm={onHandleDelete}
      >
        <p className="text-gray-700">You Submitted This Listing for Renter's Consideration Through Their Custom Offer</p>
      </Modal>
  </div>
  )
}

export default SubmittedBoats;