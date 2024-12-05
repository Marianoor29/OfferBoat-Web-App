import Location from '@/Components/Helper/Location';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

const ChooseUserType = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [termsConditions, setTermsConditions] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined); // State for phone number


  const userTypes = [
    { name: 'Boat Renter', value: 'BoatRenter' },
    { name: 'Boat Owner', value: 'BoatOwner' },
  ];

  const handleTypeSelection = (value: string) => {
    setSelectedType(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (value: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedType) {
      setErrorMessage('Please select a user type');
      return;
    }
    if (selectedType === 'BoatOwner' && (!frontImage || !backImage)) {
      setErrorMessage('Please upload both sides of your ID');
      return;
    }
    if (!termsConditions) {
      setErrorMessage('Please agree to the Terms and Conditions');
      return;
    }
    if (!phoneNumber) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    // Proceed with the signup logic
    console.log('Submitting form with:', { selectedType, frontImage, backImage, termsConditions, selectedAddress });
  };

  return (
    <div className="flex flex-col items-center py-5 justify-center min-h-screen bg-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Complete your profile</h1>
        <div className="space-y-4">
          <h1>Choose UserType</h1>
          {userTypes.map((type, index) => (
            <div
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedType === type.value ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                }`}
              onClick={() => handleTypeSelection(type.value)}
            >
              <input
                type="radio"
                name="userType"
                checked={selectedType === type.value}
                onChange={() => handleTypeSelection(type.value)}
                className="mr-4"
              />
              <span className="text-lg">{type.name}</span>
            </div>
          ))}
        </div>

        {selectedType === 'BoatOwner' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload front side of ID</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setFrontImage)}
                className="mt-2 py-4 px-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {frontImage && <img src={frontImage} alt="Front ID" className="mt-4 w-50 h-32 object-cover rounded-lg" />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload back side of ID</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setBackImage)}
                className="mt-2 py-4 px-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {backImage && <img src={backImage} alt="Back ID" className="mt-4 w-50 h-32 object-cover rounded-lg" />}
            </div>
          </div>
        )}

        {/* Enter PhoneNumeber */}
        <div className="mt-6">
        <h1 className="mb-4">Phone Number</h1>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter your phone number"
            defaultCountry='US'
            className="block py-4 px-4 w-full rounded-lg text-sm text-gray-900 border focus:outline-none"
          />
        </div>


        {/* Select Your Location */}
        <div className="mt-5">
          <h1 className="mb-4">Select Your Location</h1>
          <Location onAddressSelect={(address: string) => setSelectedAddress(address)} />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={termsConditions}
            onChange={() => setTermsConditions(!termsConditions)}
            className="mr-2"
          />
          <span className="text-sm">
            I agree to the{' '}
            <a href="/app/termsConditions" className="text-blue-500 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/app/privacy-policy" className="text-blue-500 underline">
              Privacy Policy
            </a>
          </span>
        </div>

        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}

        <button
          onClick={handleSubmit}
          disabled={!selectedType || (selectedType === 'BoatOwner' && (!frontImage || !backImage)) || !termsConditions}
          className={`mt-6 w-full py-2 px-4 text-white font-bold rounded-lg ${selectedType && termsConditions && (selectedType === 'BoatRenter' || (frontImage && backImage))
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default ChooseUserType;
