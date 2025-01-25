import React from "react";
import { TbLineHeight } from "react-icons/tb";
import { RiGlobalLine } from "react-icons/ri";
import { MdCategory } from "react-icons/md";

type BoatDetailsProps = {
  Length?: string;
  Model?: string;
  Category?: string;
};

const BoatDetail: React.FC<BoatDetailsProps> = ({
  Length = "Not Mention",
  Model = "Not Mention",
  Category = "Not Mention",
}) => {
  return (
    <div className="bg-white mx-auto p-1 mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">Specifications</h2>
      
      {/* First row */}
      <div className="flex justify-between mb-8">
        {/* Length */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center bg-green-600 text-white py-1 px-2 rounded-md mb-2 mr-1">
            <i className="fas fa-ruler text-sm">
            <TbLineHeight />
            </i>
            <span className="ml-2 font-medium">LENGTH</span>
          </div>
          <p className="text-gray-800">{Length}</p>
        </div>

        {/* Model */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center bg-yellow-500 text-black py-1 px-2 rounded-md mb-2 mr-1">
            <i className="fas fa-globe text-sm">
            <RiGlobalLine />
            </i>
            <span className="ml-2 font-medium">MODEL</span>
          </div>
          <p className="text-gray-800">{Model}</p>
        </div>
          {/* Category */}
          <div className="flex-1 text-center">
          <div className="flex items-center justify-center bg-orange-600 text-white py-1 px-3 rounded-md mb-2">
            <i className="fas fa-tags text-sm">
            <MdCategory />
            </i>
            <span className="ml-2 font-medium">CATEGORY</span>
          </div>
          <p className="text-gray-800">{Category}</p>
        </div>
      </div>
    </div>
  );
};

export default BoatDetail;
