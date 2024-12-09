import FeaturesSection from '@/Components/Helper/FeaturesBox';
import PackageCard from '@/Components/Helper/PackageCard';
import PhotosSlider from '@/Components/Helper/PhotosSlider';
import { useRouter } from 'next/router';
import { useState } from "react";
import { FaEdit, FaShare } from 'react-icons/fa';

export async function getServerSideProps(context: { params: { offerId: any; }; }) {
  const { offerId } = context.params;
  // Fetch offer data from your backend API
  const response = await fetch(`https://www.offerboats.com/listing/getListingById/${offerId}`);
  if (!response.ok) {
    return { notFound: true };
  }
  const offer = await response.json();
  return { props: { offer } };
}

export default function OfferPage({ offer }: any) {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const descriptionToShow = showFullDescription
    ? offer.description
    : offer.description.slice(0, 1000);

  const handleOnUpdateBoat = () => {
    router.push(`/owner/update-boat?offer=${encodeURIComponent(JSON.stringify(offer))}`);
  };

  return (
      <div className="pt-[1rem] p-[3rem]">
        <div className="flex relative justify-end">
          {/* PhotosSlider */}
              <PhotosSlider images={offer.images}
                height="h-[20rem] sm:h-[24rem] md:h-[28rem] lg:h-[36rem]" />
          <div className="absolute flex flex-row w-[8rem] p-[1rem] justify-between ">
            <button className="flex items-center justify-center border-b border-gray-500 text-white bg-black50 h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl">
              <FaShare />
            </button>
            <button className="flex items-center justify-center border-b border-gray-500 text-white bg-black50 h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl"
              onClick={() => {}}>
              <FaEdit />
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row md:flex-row w-full relative">
          {/* Left Content */}
          <div className=" w-full relative ">
            {/* Title and Description */}
            <div className="flex mt-10 gap-6">
              <div className="w-full lg:w-[90%] md:w-[90%] border-b border-gray-200 pb-5">
                <h1 className="heading">{offer.title}</h1>
                <h1 className="text-center font-thin text-gray-600 mb-5">{offer.location}</h1>
                <p className="text-justify mb-10">
                  {descriptionToShow}
                  {offer.description.length > 1000 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 ml-2 hover:underline"
                    >
                      {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                  )}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(offer.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className="text-blue-600 cursor-pointer hover:underline ">
                    Click here to view location on the map
                  </h2>
                </a>
              </div>
              <button className="cursor-pointer hover:underline"
                onClick={handleOnUpdateBoat}>
                <FaEdit className="w-[1.5rem] h-[1.5rem] text-blue-900" />
              </button>
            </div>

            {/* Features and Rules */}
            <div className="w-full lg:w-[90%] md:w-[90%]">
              <FeaturesSection features={offer.features} title='Features' />
              <FeaturesSection features={offer.rules} title='Things To Know' />
            </div>
          </div>
          {/* Right Content */}
          <PackageCard offer={offer} buttons={false} />
        </div>
      </div>
  );
}
