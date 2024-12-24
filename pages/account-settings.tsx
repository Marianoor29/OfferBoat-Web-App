'use client';
import HeaderTab from "@/Components/Helper/HeaderTab";
import Location from "@/Components/Helper/Location";
import SuccessModal from "@/Components/Helper/SuccessModel";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useContext, useState } from "react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AccountSettings = () => {
  const router = useRouter();
  const { user , updateUser, clearUser} = useContext(UserContext)!;
  const [selectedTopTab, setSelectedTopTab] = useState<string>("User Info");
  const [selectedAddress, setSelectedAddress] = useState<string | null>();
  const phone = String(user?.phoneNumber);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(phone || undefined);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: 1, name: "User Info" },
    { id: 2, name: "Password" },
    { id: 2, name: "Delete Account" },
  ];

  const onPressTab = (state: string) => {
    setSelectedTopTab(state);
  };

  const HandleCancel = () => {
    router.push('/profile');
  }

  const fetchOwnerData = async () => {
    try {
      const { userInfo } = parseCookies();
      if (!userInfo) {
        console.log("No userInfo cookie found.");
        return;
      }

      const parsedData = JSON.parse(userInfo);
      const tokenFromCookie = parsedData.token;

      if (!tokenFromCookie) {
        console.log("No token found in userInfo cookie.");
        return;
      }

      const userResponse = await axios.get(`https://www.offerboats.com/userData`, {
        headers: {
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      });

      // Include the token explicitly when updating the user
      updateUser({ ...userResponse.data, token: tokenFromCookie });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // FUNCTION TO UPDATE USERINFO
  const UpdateUserInfoHandler = async ()  => {
    const userInfo = {
      userId: user._id,  
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
      location: selectedAddress ? selectedAddress : user.location 
    };
    try {
      const response = await axios.put(`https://www.offerboats.com/updateUserInfo`, userInfo);
      if (response.data.success) {
        fetchOwnerData()
        router.push('/profile');
    }
    } catch (error) {
      setErrorMessage('Failed to update user info. Please try again.');
    } 
  };

  // FUNCTION TO UPDATE PASSWORD
  const UpdatePasswordHandler = async () => {
    try {
        // API call to reset the password
        const response = await axios.put(`https://www.offerboats.com/resetPasswordManually`, {
            userId: user._id,
            currentPassword: currentPassword,
            newPassword: newPassword,
        });

        if (response.data.success) {
            setErrorMessage('');
            setIsModalOpen(true)
            router.push('/profile');
        }
    } catch (error: any) {
        // Display error messages based on the response
        if (error.response && error.response.data && error.response.data.error) {
            setErrorMessage(error.response.data.error);
        } else {
            setErrorMessage('An error occurred. Please try again.');
        }
    }
};

// FUNCTION TO DELETE ACCOUNT
const deleteUser =  async () => {
  try {
    const response = await axios.post(`https://www.offerboats.com/user/deleteUserById`, { id: user._id });
    if (response){
      clearUser();
      window.location.href = "/auth/login";
    }
  }
    catch (error) {
      console.log('Error deleting user');
    } 
}

  return (
    <div className="bg-white">
      <HeaderTab
        tabs={tabs}
        onPress={onPressTab}
        selectedTopTab={selectedTopTab}
        selectedTabColor="bg-green-500"
      />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg shadow-lg my-5">
          {selectedTopTab === "User Info" && (
            <div className="p-8 my-2">
                 <h1 className="heading my-3">User Info</h1>
              <div className="mb-7">
                <h1 className="mb-2">
                  First Name
                </h1>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-7">
                <h1 className="mb-2">
                  Last Name
                </h1>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full  px-4 py-3 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-7">
                <h1 className="mb-2">
                  Email Address
                </h1>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-7">
                <h1 className="mb-2">Location</h1>
                <Location onAddressSelect={(address: string) => setSelectedAddress(address)} placeholder={user?.location || 'Select Your Location'} />
              </div>
              {/* Enter PhoneNumeber */}
              <div className="mt-7">
                <h1 className="mb-2">Phone Number</h1>
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder={user.phoneNumber}
                  defaultCountry='US'
                  className="block py-4 px-4 w-full rounded-lg text-sm text-gray-900 border focus:outline-none"
                />
              </div>
              <div className="my-5">
                <button
                  onClick={UpdateUserInfoHandler}
                  className="mb-2 w-full py-3 bg-renterBlue text-white rounded-md hover:bg-blue-950 focus:outline-none"
                >
                  Update Info
                </button>
                <button
                  onClick={HandleCancel}
                  className="w-full py-3 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {selectedTopTab === "Password" && (
            <div className="p-8 my-2">
                  <h1 className="heading my-3">Password</h1>
              <div className="mt-5">
                <h1 className="mb-2">Current Password</h1>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mt-5">
                <h1 className="mb-2">New Password</h1>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="my-5">
                <button
                  onClick={UpdatePasswordHandler}
                  className="mb-2 w-full py-3 bg-renterBlue text-white rounded-md hover:bg-blue-950 focus:outline-none"
                >
                  Update Password
                </button>
                <button
                  onClick={HandleCancel}
                  className="w-full py-3 bg-ownerGreen text-white rounded-md hover:bg-emerald-500 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {selectedTopTab === "Delete Account" && (
            <div className="p-8 my-2">
              <h1 className="text-sm font-bold text-center">
                Before deleting your account please ensure you have no 'Accepted' bookings. If you do, you won't be able to delete your account until all bookings are marked as 'Completed.' Try again once your bookings are completed.
              </h1>
              <div className="my-5">
                <button
                  onClick={deleteUser}
                  className="mb-2 w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="text-red-500">{errorMessage}</div>
      </div>
        {/* Modal */}
        <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Successfully Updated!"
      >
        <p className="text-gray-700">
          Your Password Has Been Successfully Updated!
        </p>
      </SuccessModal>
    </div>
  )
}

export default AccountSettings;