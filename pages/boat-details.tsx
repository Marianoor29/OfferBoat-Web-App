import FeaturesSection from '@/Components/Helper/FeaturesBox';
import OwnerProfile from '@/Components/Helper/OwnerProfile';
import PhotosSlider from '@/Components/Helper/PhotosSlider';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { FaShare } from 'react-icons/fa';

type Listing = {
  numberOfPassenger: number;
  packages: any;
  listingId : {
  _id: string;
  location: string;
  title: string;
  description: string;
  features: any;
  rules: any;
  images: string[];
  ownerId: {
    _id:string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    rating: number;
    location: string;
  };
  packages: {
    price: number;
    hours: number;
  }[]; 
}
};

const BoatDetails = ()  => {
    const router = useRouter();
    const { tripDetails } = router.query;
    const [listingDetails, setDetails] = useState<Listing | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const descriptionToShow = showFullDescription
      ? listingDetails?.listingId?.description
      : listingDetails?.listingId?.description.slice(0, 1000);

    useEffect(() => {
      if (tripDetails) {
        try {
          const parsedOffer = JSON.parse(decodeURIComponent(tripDetails as string));
          setDetails(parsedOffer);
        } catch (error) {
          console.error("Error parsing offer:", error);
        }
      }
    }, [tripDetails]);

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`https://www.offerboats.com/rating/getReviews`, {
            params: { userId: listingDetails?.listingId?.ownerId._id, userType: 'BoatOwner' }
          });
  
          if (response.data.length > 0) {
            setReviews(response.data);
          } else {
            setErrorMessage('This owner has no reviews yet!')
          }
        } catch (error) {
          setErrorMessage('This owner has no reviews yet!')
        }
      };
  
      fetchReviews();
    }, [listingDetails?.listingId?.ownerId._id]);

    return (
      <div className="pt-[1rem] p-[3rem]">
        {listingDetails ? (
          <div>
            <div className="flex relative justify-end">
              {/* PhotosSlider */}
              <PhotosSlider images={listingDetails.listingId.images}
                height="h-[20rem] sm:h-[24rem] md:h-[28rem] lg:h-[36rem]" />
              <div className="absolute p-[1rem] ">
                <button className="flex items-center justify-center text-white bg-black50 h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl">
                  <FaShare />
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
                    <h1 className="heading">{listingDetails.listingId.title}</h1>
                    <h1 className="text-center font-thin text-gray-600 mb-5">{listingDetails.listingId.location}</h1>
                    <p className="text-justify mb-10">
                      {descriptionToShow}
                      {listingDetails.listingId.description.length > 1000 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-blue-600 ml-2 hover:underline"
                        >
                          {showFullDescription ? 'See Less' : 'See More'}
                        </button>
                      )}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${encodeURIComponent(listingDetails.listingId.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2 className="text-blue-600 cursor-pointer hover:underline ">
                        Click here to view location on the map
                      </h2>
                    </a>
                  </div>
                </div>

                {/* Features and Rules */}
                <div className="w-full lg:w-[90%] md:w-[90%]">
                  <FeaturesSection features={listingDetails.listingId.features} title='Features' />
                  <FeaturesSection features={listingDetails.listingId.rules} title='Things To Know' />
                </div>
              </div>
              {/* Right Content */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden md:w-[50%] lg:w-[40%] p-4 mt-10 h-fit ">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">{listingDetails.packages[0].price}</h2>
              <h2 className="text-lg font-serif">{listingDetails.packages[0].hours} Hours</h2>
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-serif">Passengers</h2>
              <h2 className="text-lg font-serif">{listingDetails.numberOfPassenger}</h2>
            </div>
          </div>
          </div>

          <OwnerProfile offer={listingDetails.listingId} reviews={reviews} errorMessage={errorMessage} />
          </div>
        ) : (
          <p>Loading boat details...</p>
        )}
      </div>
    );
  }

  
export default BoatDetails;