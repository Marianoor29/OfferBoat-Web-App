'use client';
import AddFeatures from "@/Components/Helper/AddFeatures";
import ImagesSelector from "@/Components/Helper/ImagesSelector";
import Location from "@/Components/Helper/Location";
import PackageSelection from "@/Components/Helper/PackageSelection";
import WelcomeCard from "@/Components/Helper/WelcomeCard";
import { UserContext } from "@/context/UserContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const AddBoats = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [title, setTile] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [numberOfPassenger, setNumberOfPassenger] = useState<number>(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [rule, setRule] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [packages, setPackages] = useState([
    { id: 1, price: "$0.00", hours: "" },
  ]);
  const { user } = useContext(UserContext)!;
  

  const decreaseMembers = () => {
    if (numberOfPassenger > 0) {
      setNumberOfPassenger(numberOfPassenger - 1);
    }
  };

  const handlePriceChange = (id: number, price: any) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, price } : pkg))
    );
  };

  const handleHoursChange = (id: number, hours: any) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, hours } : pkg))
    );
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  // Validation function to check if all required fields are filled and images are within limit
  const validateForm = () => {
    if (
      !selectedAddress ||
      !title ||
      !description ||
      numberOfPassenger <= 0 ||
      features.length === 0 ||
      rule.length === 0 ||
      selectedImages.length < 1 ||
      selectedImages.length > 20 ||
      packages.length === 0
    ) {
      setErrorMessage("Please fill in all fields & Only 1 to 20 images are allowed.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  // Handle form submission (validate and show errors if necessary)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newOffer = {
      location: selectedAddress || '',
      title: title,
      description: description,
      packages: packages,
      numberOfPassengers: numberOfPassenger.toString(),
      features: features,
      images: selectedImages,
      rules: rule,
      ownerId: user?._id || ''
    };

    try {
      const formData = new FormData();
      formData.append('location', newOffer.location);
      formData.append('title', newOffer.title);
      formData.append('description', newOffer.description);
      formData.append('numberOfPassengers', newOffer.numberOfPassengers);
      formData.append('ownerId', newOffer.ownerId);
      newOffer.packages.forEach((pkg, index) => {
        formData.append(`packages[${index}][hours]`, pkg.hours);
        formData.append(`packages[${index}][price]`, pkg.price);
      });
      newOffer.features.forEach((feature: any, index: any) => {
        formData.append(`features[${index}]`, feature);
      });

      newOffer.rules.forEach((rule: any, index: any) => {
        formData.append(`rules[${index}]`, rule);
      });

      selectedImages.forEach((file, index) => {
        formData.append('images', file); 
      });
  
        const response = await axios.post(
          `https://www.offerboats.com/listing/createList`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        router.push("/owner/listings");
      } catch (error: any) {
        setErrorMessage("Failed to Create Listing, Please Try Again Later, or Check your Internet Connection!");
      };
    };

    return (
      <>
        {user.token ? (
          user.userType === 'BoatOwner' ?
            <div className="flex items-center justify-center min-h-screen bg-white">
              <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
                <h1 className="heading mb-5">Add Your Boat</h1>
                <div className="mb-7">
                  <h1 className="mb-2">Select Your Location</h1>
                  <Location onAddressSelect={(address: string) => setSelectedAddress(address)} />
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Enter Your Listing Title</h1>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTile(e.target.value)}
                    placeholder="Enter a Descriptive and Engaging Title"
                    className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Enter Your Listing Description</h1>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a Clear and Detailed Description"
                    rows={5}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Add Packages</h1>
                  <PackageSelection
                    packages={packages}
                    setPackages={setPackages}
                    onPriceChange={handlePriceChange}
                    onHoursChange={handleHoursChange}
                    hoursOptions={["2", "3", "4", "6", "8", "10"]}
                  />
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Add Features</h1>
                  <AddFeatures features={features} setFeatures={setFeatures} />
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Add Rules</h1>
                  <AddFeatures features={rule} setFeatures={setRule} placeholder="Add Rules" />
                </div>
                <div className="flex items-center justify-center space-x-12 mb-7">
                  {/* Minus Button */}
                  <button
                    onClick={decreaseMembers}
                    className="py-3 px-10 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    aria-label="Decrease Members"
                  >
                    <MinusIcon className="w-5" />
                  </button>

                  {/* Number of Passengers */}
                  <p className="text-sm font-semibold">{numberOfPassenger} Passengers</p>

                  {/* Plus Button */}
                  <button
                    onClick={() => setNumberOfPassenger(numberOfPassenger + 1)}
                    className="py-3 px-10 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    aria-label="Increase Members"
                  >
                    <PlusIcon className="w-5" />
                  </button>
                </div>
                <div className="mb-7">
                  <h1 className="mb-2">Select Your Boat Images</h1>
                  <ImagesSelector onImagesChange={handleFilesChange} />
                </div>
                <p className="mb-7 text-red-600 text-center"> {errorMessage}</p>
                <button
                  onClick={handleSubmit}
                  className="mb-7 p-4 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
                  disabled={!validateForm}
                >
                  Create Lisitng
                </button>
              </div>
            </div>
            :
            <WelcomeCard
              title='Please create a owner account to add a boat'
              subTitle='Create an account or sign in to showcase your boat, reach more customers, and start earning today!'
            />
        ) :
          (
            <WelcomeCard
              subTitle='Create an account or sign in to showcase your boat, reach more customers, and start earning today!'
            />
          )}
      </>
    )
  }

  export default AddBoats;