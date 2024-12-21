import ImagesSelector from "@/Components/Helper/ImagesSelector";
import SuccessModal from "@/Components/Helper/SuccessModel";
import { UserContext } from "@/context/UserContext";
import { TrashIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

interface Offer {
  images: string[];
  _id: string;
}

const UpdateBoatImages = () => {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | undefined>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UserContext)!;

  const handleFilesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  // Validation function to check if all required fields are filled and images are within limit
  const validateForm = () => {
    if (
      offer?.images.length === 0 &&
      (selectedImages.length < 1 || selectedImages.length > 20)
    ) {
      setErrorMessage("Please fill in all fields & Only 1 to 20 images are allowed.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };
// Function to convert old image URLs to File objects

const urlToFile = async (url: any, filename: any) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

  // Handle form submission (validate and show errors if necessary)
  const handleSubmit = async (e: React.FormEvent) => {
  const oldImages = offer?.images || []; 
  try {
    // Convert old image URLs to Files with names
    const oldImagesAsFiles = await Promise.all(
      oldImages.map((url, index) => {
        // Extract filename from URL or generate one
        const filename = url.split('/').pop() || `image_${index + 1}.jpeg`;
        return urlToFile(url, filename);
      })
    );
    // Combine old images (now as Files) and new selected images
    const totalImages = [...oldImagesAsFiles, ...selectedImages];

    const formData = new FormData();

    totalImages.forEach((file: any, index) => {
      formData.append('images', file); 
    });

  const response = await axios.put(
        `https://www.offerboats.com/listing/editListingImages/${offer?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
  
      setIsModalOpen(true);
      router.push(`/owner/listings`);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(
        "Failed to Update Listing. Please Try Again Later, or Check your Internet Connection!"
      );
    }
  };
   
  useEffect(() => {
    if (router.query.offer) {
      const safeOffer = decodeURIComponent(router.query.offer as string);
      const parsedOffer = JSON.parse(safeOffer);
      setOffer(parsedOffer);
    }
  }, [router.query.offer]);
  
  const handleRemoveImage = (index: number) => {
    if (offer) {
      const updatedImages = offer.images.filter((_, i) => i !== index);
      setOffer({ ...offer, images: updatedImages });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
        <h1 className="heading mb-5">Update Your Boat Images</h1>
       {/* Display old images */}
       <h1 className="mb-2">Current Boat Images</h1>
        <div className="mb-7 flex flex-row justify-start items-center">
          {offer?.images.map((image, index) => (
            <div key={index} className="relative lg:h-24 md:h-24 h-20 w-[130px] mr-2">
              <Image
                src={image}
                alt="Offerboat - Your Budget, Our Boats"
                fill
                sizes="w-[100%] h-[100%]"
                className="rounded-md object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute m-1 py-1 px-1 bg-black50 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                <TrashIcon className="text-white w-4" />
              </button>
            </div>
          ))}
        </div>
        {/* ImagesSelector for new images */}
        <div className="mb-7">
          <h1 className="mb-2">Select New Boat Images</h1>
          <ImagesSelector
          images={selectedImages}
          onImagesChange={handleFilesChange}
          />
        </div>
        <p className="mb-7 text-red-600 text-center"> {errorMessage}</p>
        <button
          onClick={handleSubmit}
          className="mb-7 p-4 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
          disabled={!validateForm}
        >
          Update Images
        </button>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Successfully Updated!? "
      >
        <p className="text-gray-700">
          Your Listing Images Has Been SuccessFully Updated!
        </p>
      </SuccessModal>
    </div>
  )
}

export default UpdateBoatImages;