import Location from '@/Components/Helper/Location';
import { UserContext } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import React, { useContext, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const ChooseUserType = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>('');
  const [backImage, setBackImage] = useState<string | null>('');
  const [termsConditions, setTermsConditions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined); 
  const [userdata, setUserData] = useState<any>(null);
  const { userData } = parseCookies();
  const { setUser } = useContext(UserContext)!;

  // Retrieve user data from localStorage when the component mounts
  useEffect(() => {
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserData(parsedData);
    } else {
      router.push('/auth/sign-up'); 
    }
  }, []);

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

  const handleSubmit = async () => {
    setErrorMessage(null);
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
    if (!selectedAddress) {
      setErrorMessage('Please select your location');
      return;
    }

    // SingUp Logic
    try {
      if (selectedType === 'BoatOwner') {
        const formData = new FormData();
        // Convert Base64 to Blob
      const dataURLtoBlob = (dataUrl: string): Blob => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      };

          // Append the frontImage as a Blob
    if (frontImage) {
      formData.append('frontImage', dataURLtoBlob(frontImage), 'frontImage.jpg');
    }

    // Append the backImage as a Blob
    if (backImage) {
      formData.append('backImage', dataURLtoBlob(backImage), 'backImage.jpg');
    }

      formData.append('email', userdata?.email);
  
        const uploadResponse = await axios.post(`https://www.offerboats.com/uploadDocuments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (uploadResponse.status !== 200) {
          throw new Error('Failed to upload documents');
        }
      }
  
      const payload = {
        email: userdata?.email,
        userType: selectedType,
        phoneNumber,
        firstName: userdata?.firstName,
        lastName: userdata?.lastName,
        password: userdata?.password,
        rating: 0,
        termsAndPolicies: termsConditions,
        profilePicture: userdata?.type === 'googleSignup' ? userdata?.profilePicture : undefined,
        location: selectedAddress
      };
  
      const endpoint = userdata?.type === 'googleSignup' ? '/web-googleSignup' : '/web-signup';
      const response = await axios.post(`https://www.offerboats.com${endpoint}`, payload);
      
      const { token } = response.data;
      setUser({ token, userType: selectedType  });
      destroyCookie(null, 'userData', { path: '/' });
      window.location.href = "/";
    } catch (error:any) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } 
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
              {frontImage && <img src={frontImage} alt="Offerboat - Your Budget, Our Boats" className="mt-4 w-50 h-32 object-cover rounded-lg" />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload back side of ID</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setBackImage)}
                className="mt-2 py-4 px-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {backImage && <img src={backImage} alt="Offerboat - Your Budget, Our Boats" className="mt-4 w-50 h-32 object-cover rounded-lg" />}
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
          disabled={!selectedType || (selectedType === 'BoatOwner' && (!frontImage || !backImage)) || !termsConditions || !selectedAddress}
          className={`mt-6 w-full py-2 px-4 text-white font-bold rounded-lg ${selectedType && termsConditions && selectedAddress && (selectedType === 'BoatRenter' || (frontImage && backImage))
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
