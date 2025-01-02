import ListCard from "@/Components/ListCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

interface CustomOffer {
  _id: any;
  createdAt: string | number | Date;
  userId: string;
  location: string;
  date: string;
  time: string;
  price: string;
  tripInstructions: string;
  numberOfPassenger: number;
  hours: string;
  captain: boolean;
  status?: string;
  userImage?: string;
  userName?: string;
  userRating?: number;
}

const Offers = () => {
  const router = useRouter();
  const [customOffers, setCustomOffers] = useState<CustomOffer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { user } = useContext(UserContext)!;

  const fetchCustomOffer = async (userId: string) => {
    try {
      const response = await axios.get(`https://www.offerboats.com/customOffers/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        const sortedOffers = response.data.sort(
          (a: CustomOffer, b: CustomOffer) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCustomOffers(sortedOffers);
      } else {
        setCustomOffers([]);
        setErrorMessage('No offers found.');
      }
    } catch (error) {
      setCustomOffers([]);
    } 
  };

  useEffect(() => {
    if (user?._id) {
      fetchCustomOffer(user?._id);
    }
  }, [user?._id]);

const onPress = (offer: any) => {
  router.push({
    pathname: '/renter/custom-offers',
    query: { offer: encodeURIComponent(JSON.stringify(offer)) },
});
}
const handleOnOffer = () => {
  router.push(`/owner/add-boat`);
};
    return (
      <div className="min-h-screen bg-white py-4">
          <h1 className="heading lg:text-[25px] md:text-[21px] text-[15px]">Your Custom Offers</h1>
          {errorMessage || customOffers.length === 0 ? (
                  <div className="flex flex-col items-center">
                  <p className="text-red-600 text-center mt-4">{errorMessage || "No offers found."} </p>
                  <button
                    className="bg-white text-renterBlue px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
                    onClick={handleOnOffer}>
                    Publish a Custom Offer
                  </button>
                </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto mt-[2rem]">
            {customOffers?.map((offer, index) => (
                 <ListCard
                 key={index}
                 userImage={user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                 renterName={`${user?.firstName} ${user?.lastName}`}
                 date={offer?.date}
                 time={offer?.time}
                 hours={offer?.hours}
                 captain={offer?.captain}
                 passengers={offer?.numberOfPassenger}
                 location={offer?.location}
                 rating={user?.rating || 0}
                 price={offer?.price}
                 tripInstructions={offer?.tripInstructions}
                 buttonTitle="Check Details"
                 onPress={() => onPress(offer)}
               />
              ))}
            </div>
          )}
        </div>
    )
}

export default Offers;