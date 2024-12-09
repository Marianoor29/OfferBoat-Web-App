import AddBoatBanner from "@/Components/Helper/AddBoatBanner";
import MakeOfferBanner from "@/Components/Helper/MakeOfferBanner";
import Hero from "@/Components/Hero";
import LatestBoats from "@/Components/LatestBoats";
import LatestOffers from "@/Components/LatestOffers";
import TopDestination from "@/Components/TopDestination";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const HomePage = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<[]>([]);
  const [listing, setListing] = useState<[]>([]);
  const [address, setAddress] = useState<string>(""); 
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setToken(userInfo?.token || null);
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
        if (!token) return;
        const userResponse = await axios.get(`https://www.offerboats.com/userData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const existingUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const updatedUserInfo = {
          ...existingUserInfo, 
          ...userResponse.data, 
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        const { _id,} = userResponse.data;
        setUserId(_id);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };

    if (token) fetchOwnerData();
  }, [token]);

  return (
    <div className="">
      <Hero  handleSearch={handleSearch}  setAddress={setAddress} />
      <TopDestination />
      <LatestBoats boats={listing} onSeeMore={handleSeeMoreBoats}/>
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <MakeOfferBanner onClick={handleMakeOffer}/>
      </div>
      <LatestOffers offers={[...offers, ]} onSeeMore={handleSeeMoreOffers} />
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <AddBoatBanner onClick={handleAddBoat}/>
      </div>
    </div>
  );
};

export default HomePage;
