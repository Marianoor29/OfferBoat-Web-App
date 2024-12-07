import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

interface AddFeaturesProps {
  features: string[];
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
}

const AddFeatures: React.FC<AddFeaturesProps> = ({ features, setFeatures , placeholder = "Add Features"}) => {
  const [featureInput, setFeatureInput] = useState<string>("");

  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput]);
      setFeatureInput(""); 
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter((item) => item !== feature));
  };

  return (
    <div className="space-y-6">
      {/* Input and Add Feature Button */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder={placeholder}
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddFeature}
          className="text-2xl text-black"
        >
          <IoAddCircleOutline />
        </button>
      </div>

      {/* Feature List */}
      <ul className="space-y-4">
        {features.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-md"
          >
            <h1 className="text-gray-800">{item}</h1>
            <button
              type="button"
              onClick={() => handleRemoveFeature(item)}
              className="text-xl text-black"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFeatures;
