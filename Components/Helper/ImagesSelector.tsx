import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import React, { useState } from "react";

interface ImagesSelectorProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void; 
}

const ImagesSelector: React.FC<ImagesSelectorProps> = ({
  images = [],
  onImagesChange = () => null, 
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(images);
  const [loading, setLoading] = useState<boolean>(false); 

  // Handle image selection
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      setLoading(true);

      // Compress and add the selected images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const compressedImage = await compressImage(file);
          const imageUrl = URL.createObjectURL(compressedImage);
          newImages.push(imageUrl);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }

      // Update the state with new images
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);

      // Call the onImagesChange function to update parent component
      onImagesChange(updatedImages);
      setLoading(false);
    }
  };

  // Function to compress image
  const compressImage = async (file: File) => {
    const options = {
      maxWidthOrHeight: 800, // Set max width or height of image
      maxSizeMB: 1, // Limit image size to 1MB
      useWebWorker: true, // Enable web worker for performance
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error during image compression:", error);
      throw error;
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesChange(updatedImages); 
  };

  return (
    <div className={`rounded-lg bg-gray-50`}>
      <div className="top-full left-0 mt-2 p-4 shadow-lg rounded-md w-full">
        {loading ? (
          // Show loader while images are loading
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedImages.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold">Images</h3>
            <div className="grid grid-cols-5 lg:grid-cols-6 gap-1 mt-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative lg:h-24 md:h-24 h-20 w-30">
                  <Image
                    src={image}
                    alt="Offerboat - Your Budget, Our Boats"
                    fill
                    sizes="w-[100%] h-[100%]"
                    className="rounded-md object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)} // Remove image on click
                    className="absolute m-1 py-1 px-1 bg-black50 rounded-md hover:bg-gray-300 focus:outline-none"
                  >
                    <TrashIcon className="text-white w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h3 className="text-xl font-semibold">No selected images</h3>
        )}
        <label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
          <button
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click();
            }}
            className="flex relative items-center justify-center mt-4 h-14 w-40 rounded-lg bg-gray-50 border border-gray-300"
          >
            Select Images
          </button>
        </label>
      </div>
    </div>
  );
};

export default ImagesSelector;
