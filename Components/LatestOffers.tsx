import React from "react";
import OfferCard from "./Helper/OfferCard";
import ListCard from "./ListCard";
import { FaArrowRightLong } from "react-icons/fa6";

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
}

const LatestOffers = ({
  offers, 
  onSeeMore
}:LatestOffersProps) => {
  return (
    <div className="pt-[2rem] pb-[2rem] ">
      <h1 className="heading lg:text-[25px] md:text-[21px] text-[15px]">Latest Offers in Miami</h1>
      <p className="text-center">Boat owners can find relevant offers and send their boats that meet the conditions, along with a proposed price for consideration.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto mt-[2rem]">
      {offers.slice(0, 9).map((offer, index) => (
           <ListCard
           key={index}
           renterName={`${offer.userId.firstName} ${offer.userId.lastName}`}
           date={offer.date}
           time={offer.time}
           hours={offer.hours}
           captain={offer.captain}
           passengers={offer.numberOfPassenger}
           location={offer.location}
           rating={offer.userId.rating}
           price={offer.price}
           tripInstructions={offer.tripInstructions}
           buttonTitle="Offer Your Boat"
           onPress={offer.onPress}
           onPressImage={offer.onPressImage}
         />
        ))}
      </div>
      <div className="flex justify-center mt-[2rem]">
        <button
          onClick={onSeeMore}
          className="flex items-center justify-between py-3 w-[12%] text-green-600 font-semibold hover:opacity-70 transition"
        >
          See More Offers <FaArrowRightLong size={28} />
        </button>
      </div>
    </div>
  );
};

export default LatestOffers;