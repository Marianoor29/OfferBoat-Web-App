import React from 'react';
import Image from 'next/image';
import PhotosSlider from './PhotosSlider';

interface OfferCardProps {
  title?: string;
  boatOwnerImage?: string;
  ButtonColor?: string;
  buttonTitle?: string;
  members?: number;
  location?: string;
  onPress?: () => void;
  description?: string;
  images: string[];
  blockedView?: boolean;
  maxImages?: number;
}

const OfferCard: React.FC<OfferCardProps> = ({
  boatOwnerImage,
  title,
  members,
  location,
  description,
  buttonTitle = 'View Deal',
  images,
  onPress = () => {},
  ButtonColor = 'bg-blue-900',
  blockedView = false,
}) => {
    // Helper function to truncate text after a given word limit
    const truncateText = (text: string, wordLimit: number) => {
      const words = text.split(' ');
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(' ') + '...';
    };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-90 lg:w-96 mx-auto my-4 relative">
      {/* Slider and Members Badge Container */}
      <div className="relative">
        <PhotosSlider images={images} />

        {members && (
          <div className="absolute bottom-4 right-4 text-white text-sm py-1 px-3 rounded-full z-10"
          style={{ backgroundColor: '#00000050' }} >
            {members} Passengers
          </div>
        )}

        {blockedView && (
          <div className="absolute top-2 right-2 bg-white text-red-600 text-sm font-semibold py-1 px-3 rounded-md shadow-md z-10">
            Blocked
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-2  items-center">
        {/* Left Section: Owner Image, Title, Description, Location */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            {/* Boat Owner Image */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={boatOwnerImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="Boat Owner"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h4 className="text-m font-semibold text-black truncate">
                {truncateText(title || '', 4)} {/* Limit title to 5 words */}
              </h4>
              <p className="text-black text-sm truncate ">
                {truncateText(description || '', 4)} {/* Limit description to 10 words */}
              </p>
              <p className="text-gray-400 text-sm">
                {truncateText(location || '', 4)} {/* Limit location to 5 words */}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Action Button */}
        <button
          onClick={onPress}
          className={`py-2 px-2 w-full text-white font-semi rounded-lg ${ButtonColor} transition hover:opacity-90`}
        >
          {buttonTitle}
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
