import AddBoatBanner from "@/Components/Helper/AddBoatBanner";
import MakeOfferBanner from "@/Components/Helper/MakeOfferBanner";
import ReviewSlider from "@/Components/Helper/ReviewSlider";
import Hero from "@/Components/Hero";
import LatestBoats from "@/Components/LatestBoats";
import LatestOffers from "@/Components/LatestOffers";
import TopDestination from "@/Components/TopDestination";
import { BoatsList } from "@/dummyData";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fetchOffers = async (ownerId?: string, location?: string) => {
  try {
    let response;

    if (ownerId) {
      response = await axios.get(`https://www.offerboats.com/getAllOffers?ownerId=${ownerId}&location=${location}`);
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

const HomePage = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<[]>([]);
  const [address, setAddress] = useState<string>(""); 

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
    const loadOffers = async () => {
      const fetchedOffers = await fetchOffers(undefined, "Miami, FL, USA"); 
      setOffers(fetchedOffers);
    };

    loadOffers();
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

  return (
    <div className="">
      <Hero  handleSearch={handleSearch}  setAddress={setAddress} />
      <TopDestination />
      <LatestBoats boats={BoatsList} onSeeMore={handleSeeMoreBoats} />
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <MakeOfferBanner />
      </div>
      <LatestOffers offers={[...offers, ...offers, ...offers, ...offers, ...offers, ...offers, ]} onSeeMore={handleSeeMoreOffers} />
      <div className="flex pt-[2rem] bg-white pb-[2rem] items-center justify-center ">
      <AddBoatBanner />
      </div>
    </div>
  );
};

export default HomePage;
