"use client";
import AddBoatBanner from "@/Components/Helper/AddBoatBanner";
import MakeOfferBanner from "@/Components/Helper/MakeOfferBanner";
import Hero from "@/Components/Hero";
import LatestBoats from "@/Components/LatestBoats";
import LatestOffers from "@/Components/LatestOffers";
import TopDestination from "@/Components/TopDestination";
import { UserContext } from "@/context/UserContext";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from "react";

const HomePage = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<[]>([]);
  const [listing, setListing] = useState<[]>([]);
  const [address, setAddress] = useState<string>(""); 
  const [userId, setUserId] = useState('');
  const { updateUser } = useContext(UserContext)!;

  
  useEffect(() => {
    AOS.init({
      disable: false,
      startEvent: "DOMContentLoaded",
      initClassName: "aos-init",
      animatedClassName: "aos-animate",
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 1000,
      easing: "ease",
      once: true,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }, []);

  useEffect(() => {
      const fetchOffers = async () => {
        try {
         const response = await axios.get(`https://www.offerboats.com/latest-customOffers`);
      
          const offers = response.data.offers;
          const sortedOffers = offers.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
      
          setOffers(sortedOffers);
        } catch (error) {
          console.error("Error fetching offers:", error);
          return [];
        }
      };

    fetchOffers();
  }, []);

  useEffect(() => {
      const fetchListings = async () => {
        try {
        const response = await axios.get(`https://www.offerboats.com/listing/latest-listings`);
      
          const offers = response.data.modifiedListings;
          const sortedOffers = offers.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
      
          setListing(sortedOffers);
        } catch (error) {
          console.error("Error fetching offers:", error);
          return [];
        }
      };

      fetchListings();
  }, []);

  const handleSeeMoreBoats = () => {
    router.push("/boats");
  };

  const handleSeeMoreOffers = () => {
    router.push("/offers");
  };

  const handleSearch = () => {
    if (address.trim()) {
      router.push(`/boats?address=${encodeURIComponent(address)}`);
    }
  };

  const handleAddBoat = () => {
    router.push("/owner/add-boat");
  };
  
  const handleMakeOffer = () => {
    router.push("/renter/make-offer");
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const { userInfo } = parseCookies();
        if (!userInfo) {
          console.log("No userInfo cookie found.");
          return;
        }
  
        const parsedData = JSON.parse(userInfo);
        const tokenFromCookie = parsedData.token;
  
        if (!tokenFromCookie) {
          console.log("No token found in userInfo cookie.");
          return;
        }
  
        const userResponse = await axios.get(`https://www.offerboats.com/userData`, {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
          },
        });
  
        // Include the token explicitly when updating the user
        updateUser({ ...userResponse.data, token: tokenFromCookie });
        setUserId(userResponse.data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchOwnerData();
  }, []);
  
  
  return (
    <div className="">
      <Hero  handleSearch={handleSearch}  setAddress={setAddress} />
      <TopDestination />
      <LatestBoats boats={listing} onSeeMore={handleSeeMoreBoats}/>
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <MakeOfferBanner onClick={handleMakeOffer}/>
      </div>
      <LatestOffers offers={offers} onSeeMore={handleSeeMoreOffers} />
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <AddBoatBanner onClick={handleAddBoat}/>
      </div>
    </div>
  );
};

export default HomePage;
