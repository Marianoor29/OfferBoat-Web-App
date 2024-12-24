'use client';
import OfferCard from "@/Components/Helper/OfferCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type Listing = {
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

const Favorites = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [savedBoats, setSavedBoats] = useState<Listing[]>([]);
  const { user } = useContext(UserContext)!;

  const fetchSavedListings = async () => {
    try {
      const response = await axios.get(
        `https://www.offerboats.com/listing/getSavedListings/${user?._id}`
      );

      if (response.data.success) {
        setSavedBoats(response.data.savedListings);
        setErrorMessage('');
      } else {
        setErrorMessage(`You don't have any favorite boats yet!`);
      }
    } catch (error) {
      setErrorMessage(`You don't have any favorite boats yet!`);
    } 
  };

  useEffect(() => {
    if (user?._id) {
      fetchSavedListings();
    } else {
      setErrorMessage('You don\'t have any favorite boats yet!');
    }
  }, [user?._id]);

  const handleOnPress = (id: string) => {
    router.push(`/app/${id}`);
  };

  return (
    <div className="bg-white">
      <h1 className="heading mt-6">Favorite Boats</h1>
      {savedBoats.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-center mt-4">{errorMessage || `You Don't Have Any Listings Yet!`} </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
          {savedBoats?.map((item: Listing) => (
            <OfferCard
              key={item._id}
              title={item.title}
              boatOwnerImage={item.ownerId?.profilePicture}
              members={item.numberOfPassengers}
              location={item.location}
              description={item.description}
              images={item?.images}
              onPress={() => handleOnPress(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
