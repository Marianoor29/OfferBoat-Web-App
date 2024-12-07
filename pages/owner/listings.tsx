import OfferCard from "@/Components/Helper/OfferCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Listing = {
  ownerId: any;
  _id: string;
  title: string;
  location: string;
  profilePicture: string;
  description: string;
  images: string[];
  numberOfPassengers: number;
  createdAt: string; // Add this property to sort by date
};

const fetcher = async (url: string) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const Listings = () => {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 3,
  });

  const swrKey = `https://www.offerboats.com/listing/ownerListings`;

  const { data: allListing, error } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  console.log('Fetched Listings:', allListing); // Log fetched data

  // Ensure you access the listings properly and sort them by `createdAt`
  const listings = allListing?.listings || [];
  
  // Sort listings by createdAt in descending order (new listings first)
  const sortedListings = listings.sort((a: Listing, b: Listing) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Sorting in descending order
  });

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

  return (
    <div className="bg-white">
      {error && <p className="text-red-500 text-center mt-4">Failed to load listings. Please try again.</p>}
      
      {/* Render message if no listings */}
      {sortedListings.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-center mt-4">You Don't Have Any Listings Yet!</p>
          <button 
            className="bg-white text-emerald-600 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif">
            Add Your Boats
          </button>
        </div>
      ) : (
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${dimensions.columnCount}, 1fr)` }}>
          {sortedListings.map((item: Listing) => (
            <OfferCard
              key={item._id}
              title={item.title}
              boatOwnerImage={item.ownerId?.profilePicture}
              members={item.numberOfPassengers}
              location={item.location}
              description={item.description}
              images={item.images}
              onPress={() => handleOnPress(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
