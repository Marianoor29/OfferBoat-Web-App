import ListCard from "@/Components/ListCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

interface LatestOffersProps {
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

const fetchOffers = async (userId?: string, location?: string) => {
  try {
    let response;
    if (userId !== undefined) {
      response = await axios.get(`https://www.offerboats.com/getAllOffers?ownerId=${userId}&location=${location}`);
    } else {
      response = await axios.get(`https://www.offerboats.com/customOffersByLocation?location=${location}`);
    }

    const offers = response.data.offers || response.data;

    // Sort Offers by Creation Date (Newest First)
    const sortedOffers = offers.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return sortedOffers;
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500" />
  </div>
);

const OffersPage = ({
  address,
  setAddress,
}: LatestOffersProps) => {
  const router = useRouter();
  const { address: queryAddress } = router.query;
  const [offers, setOffers] = useState<LatestOffersProps['offers']>([]);
  const { user } = useContext(UserContext)!;
  const userId = user._id || undefined

  useEffect(() => {
    if (queryAddress) {
      setAddress(queryAddress as string);
    } else {
      setAddress("Miami, FL, USA");
    }
  }, [queryAddress, setAddress]);


  useEffect(() => {
    const loadOffers = async () => {
      const fetchedOffers = await fetchOffers(userId, address);
      setOffers(fetchedOffers);
    };
  
    loadOffers();
  }, [address]);
  
  return (
    <div className="p-1 min-h-screen">
      {!offers ? (
        <Loader />
      ) : offers.length === 0 ? (
        <div className="text-center text-red-500">
          No offers found in {address}.
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
              hours={offer?.hours}
              captain={offer?.captain}
              passengers={offer?.numberOfPassenger}
              location={offer?.location}
              rating={offer?.userId?.rating}
              price={offer?.price}
              tripInstructions={offer?.tripInstructions || 'no instructions provided'}
              buttonTitle="Offer Your Boat"
              onPress={() => console.log(`Clicked on offer ID`)}
              onPressImage={() => console.log(`Clicked on image of offer ID`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
