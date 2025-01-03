'use client';
import React from "react";
import OfferCard from "./Helper/OfferCard";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface LatestBoatsProps {
  boats: {
    ownerId: any;
    _id(_id: any): void;
    numberOfPassengers: number | undefined;
    title: string;
    boatOwnerImage?: string;
    ButtonColor?: string;
    buttonTitle?: string;
    members?: number;
    location?: string;
    description?: string;
    images: string[];
    onPress?: () => void;
  }[];
  onSeeMore?: () => void;

}

const LatestBoats = ({
  boats, 
  onSeeMore,
}:LatestBoatsProps) => {
  const router = useRouter();
  const onPress = (_id: any) => {
    router.push(`/app/${_id}`);
  }
  return (
    <div className="pt-[2rem] pb-[2rem]">
      <h1 className="heading lg:text-[25px] md:text-[21px] text-[15px]">Latest Boats in Miami</h1>
      <p className="text-center font-serif">Browse available boats, book your trip and set sail with experienced captains at your service.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto mt-[2rem]">
      {boats?.map((boat, index) => (
          <OfferCard
            key={index}
            title={boat?.title}
            boatOwnerImage={boat?.ownerId.profilePicture}
            ButtonColor={boat?.ButtonColor}
            buttonTitle={boat?.buttonTitle}
            members={boat?.numberOfPassengers}
            location={boat?.location}
            description={boat?.description}
            images={boat?.images}
            onPress={() => onPress(boat?._id)}
          />
        ))}
      </div>
      <div className="flex justify-center mt-[2rem]">
        <button
          onClick={onSeeMore}
          className="flex items-center justify-between py-3 w-[30%] lg:w-[12%] md:w-[20%] text-blue-900 font-serif  text-sm md:text-base lg:text-lg hover:opacity-70 transition"
        >
          See More Boats <FaArrowRightLong size={28} />
        </button>
      </div>
    </div>
  );
};

export default LatestBoats;