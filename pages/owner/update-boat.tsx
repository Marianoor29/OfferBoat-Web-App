import AddFeatures from "@/Components/Helper/AddFeatures";
import Location from "@/Components/Helper/Location";
import Modal from "@/Components/Helper/ModelWrapper";
import PackageSelection from "@/Components/Helper/PackageSelection";
import { UserContext } from "@/context/UserContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface Offer {
  _id: string;
  title: string;
  description: string;
  numberOfPassengers: number;
  features: string[];
  rules: string[];
  location: string;
  packages: { id: number; price: string; hours: string }[];
}

const UpdateBoat = () => {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | undefined>();
  const [selectedAddress, setSelectedAddress] = useState<string | null>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [numberOfPassenger, setNumberOfPassenger] = useState<number>(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [rule, setRule] = useState<string[]>([]);
  const [packages, setPackages] = useState<Offer['packages']>([{ id: 1, price: "$0.00", hours: "" }]);  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useContext(UserContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const decreaseMembers = () => {
    if (numberOfPassenger > 0) {
      setNumberOfPassenger(numberOfPassenger - 1);
    }
  };

  const handlePriceChange = (id: number, price: any) => {
    setPackages((prev: any[]) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, price } : pkg))
    );
  };

  const handleHoursChange = (id: number, hours: any) => {
    setPackages((prev: any[]) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, hours } : pkg))
    );
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
      const id = offer?._id; 
      const updatedOffer = {
        title: title,
        description:description,
        rules: rule, 
        features: features,
        packages: packages,
        numberOfPassengers: numberOfPassenger,
        location: selectedAddress ,
      };
      try {
  
        const response = await axios.put(`https://www.offerboats.com/listing/editList/${id}`, updatedOffer, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });
        router.push(`/owner/${id}`);
      } catch (error: any) {
          setErrorMessage("Failed to Update Listing, Please Try Again Later, or Check your Internet Connection!");
      } 
  };

  useEffect(() => {
    if (router.query.offer) {
  const safeOffer = decodeURIComponent(router.query.offer as string);
  const parsedOffer = JSON.parse(safeOffer);
  setOffer(parsedOffer);
    }
  }, [router.query.offer])

  useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setDescription(offer.description);
      setNumberOfPassenger(offer.numberOfPassengers);
      setFeatures(offer.features);
      setRule(offer.rules);
      setPackages(offer.packages);
      setSelectedAddress(offer.location)
    }
  }, [offer]);
  
  const handleDelete = async () => {
    const id = offer?._id;
    try {
      const response = await axios.delete(`https://www.offerboats.com/listing/deleteList/${id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      setIsModalOpen(false);
      router.push(`/owner/listings`);
    } catch (error) {
      setErrorMessage('Failed to delete listing. Please try again.');
    } 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col w-full max-w-3xl p-8 space-y-6 my-5 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between">
        <h1 className="heading mb-5 text-center">Update Your Boat Details</h1>
        <button className="flex items-center justify-center text-red-600 bg-white h-[2.5rem] w-[2.5rem] rounded-3xl shadow-3xl"
       onClick={() => setIsModalOpen(true)}>
              <FaTrash />
            </button>
        </div>
        <div className="mb-7">
          <h1 className="mb-2">Select Your Location</h1>
          <Location onAddressSelect={(address: string) => setSelectedAddress(address)} placeholder={offer?.location || 'Select Your Location'} />
        </div>
        <div className="mb-7">
          <h1 className="mb-2">Enter Your Listing Title</h1>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        <p className="mb-7 text-red-600 text-center"> {errorMessage}</p>
        <button
          onClick={handleSubmit}
          className="mb-7 p-4 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
          disabled={!validateForm}
        >
          Update Lisitng
        </button>
      </div>
       {/* Modal */}
       <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Are you sure you want to delete this listing? "
        onConfirm={handleDelete}
      >
        <p className="text-gray-700">All pending requests related to this listing on the custom offers, will also be deleted.</p>
      </Modal>
    </div>
  )
}

export default UpdateBoat;