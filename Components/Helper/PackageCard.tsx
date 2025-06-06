import { FaPeopleGroup } from "react-icons/fa6";

const PackageCard = ({ offer, buttons = true , onClickBookNow, onClickMakeOffer}: any) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden md:w-[50%] lg:w-[40%] p-4 mt-10 h-fit ">
      <h1 className="heading text-[20px] mb-5 mt-5">PACKAGES</h1>
      {offer.packages.map((item: any, index:any) => {
        return (
          <div  key={index} className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
            <h2 className="text-lg font-serif">{item.price}</h2>
            <h2 className="text-lg font-serif">{item.hours} Hours</h2>
          </div>
        )
      })}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
        <FaPeopleGroup className="text-green-700 h-5 w-5" />
        <h2 className="text-lg font-serif">{offer.numberOfPassengers} Passengers</h2>
      </div>
      {buttons && (
        <div className="flex flex-col gap-4">
          <button
            className="rounded-lg overflow-hidden font-medium group bg-renterBlue text-center px-4 py-2"
            onClick={onClickBookNow}>
            <span className="text-white">Book Now</span>
          </button>
          <button
            className="rounded-lg overflow-hidden font-medium group bg-renterBlue text-center px-4 py-2"
            onClick={onClickMakeOffer}>
            <span className="text-white">Make Offer</span>
          </button>
        </div>
      )}


    </div>
  );
};

export default PackageCard;
