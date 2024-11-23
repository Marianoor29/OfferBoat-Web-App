import { useState } from 'react';
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const FeaturesSection = ({ features , title }: any) => {
  // State to manage whether to show all features or just the first 5
  const [showAll, setShowAll] = useState(false);

  // Slice the features array based on showAll state
  const displayedFeatures = showAll ? features : features.slice(0, 5);

  return (
    <div className="w-full border-b border-gray-200 pb-6 p-[3rem]">
      <h1 className="heading text-[20px] text-start">{title}</h1>
      <div className="mt-5">
        {displayedFeatures.map((item: any, index: number) => (
          <div className="flex justify-start items-center mb-6" key={index}>
            <IoCheckmarkCircleOutline className="text-green-700 h-5 w-5" />
            <h2 className="text-lg font-serif ml-5">{item}</h2>
          </div>
        ))}
      </div>

      {/* Show "See More" button if there are more than 5 features */}
      {features.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 mt-3 hover:underline"
        >
          {showAll ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

export default FeaturesSection;
