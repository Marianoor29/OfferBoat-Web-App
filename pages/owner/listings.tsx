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


const Listings = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([])
  const { user } = useContext(UserContext)!;
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 3,
  });

  const fetchListings = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/listing/ownerListings`,{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data ) {
        // Sort listings by `createdAt` in descending order
        const sortedListings = response.data.listings.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setListings(sortedListings)
    } } 
    catch (error) {
      setErrorMessage(`You Don't Have Any Listings Yet!`)
      setListings([]);
    } 
  };

  useEffect(() => {
    if (user?.token) {
      fetchListings();
    }
  }, [user?.token]);


  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.96;
      const height = window.innerHeight * 0.8;

      let columnCount;
      if (window.innerWidth >= 1024) columnCount = 3;
      else if (window.innerWidth >= 768) columnCount = 2;
      else columnCount = 1;
      setDimensions({ width, height, columnCount });
    };
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleOnPress = (id: string) => {
    router.push(`/owner/${id}`);
  };

  const handleOnAddBoats = () => {
    router.push(`/owner/add-boat`);
  };

  return (
    <div className="bg-white">
      {/* Render message if no listings */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-center mt-4">{errorMessage || `You Don't Have Any Listings Yet!`} </p>
          <button
            className="bg-white text-emerald-600 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
            onClick={handleOnAddBoats}>
            Add Your Boats
          </button>
        </div>
      ) : (
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${dimensions.columnCount}, 1fr)` }}>
          {listings?.map((item: Listing) => (
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

export default Listings;
