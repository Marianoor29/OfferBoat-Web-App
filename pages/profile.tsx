'use client';
import Rating from "@/Components/Helper/Rating";
import SuccessModal from "@/Components/Helper/SuccessModel";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";

const Profile = () => {
  const router = useRouter();
  const { user } = useContext(UserContext)!;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccountSetting = () => {
    router.push("/account-settings");
  };

  const handleCloseModel = () => {
    router.push("/");
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfilePicture = async () => {
    const userId = user?._id;
    try {
      const formData = new FormData();
    if (!userId) {
      setErrorMessage("User ID is missing.");
      return;
    }
    formData.append('userId', userId);
      if (imageFile) {
        formData.append("profilePicture", imageFile);
      } else {
        setErrorMessage("Please select a profile picture.");
        return; 
      }

      await axios.post(`https://www.offerboats.com/uploadProfilePicture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsModalOpen(true)
    } catch (error) {
      setErrorMessage('Failed to update profile picture. Please try again.');
    }
  };

  const onClickUpdate = () => {
    if (selectedImage) {
      updateProfilePicture()
    } else {
      const fileInput = document.getElementById("profilePicture") as HTMLInputElement;
      fileInput?.click();
    }
  }

  return (
    <div className="bg-white p-10">
      <div className="flex lg:flex-row md:flex-row flex-col mb-3">
        <div className="flex w-full ">
            <div className="w-36 h-36 rounded-full cursor-pointer">
              <Image src={selectedImage || user.profilePicture || ""}
              alt="Offerboat - Your Budget, Our Boats"
              className="w-32 h-32 rounded-full"
              width={200}
              height={200}
              />
            </div>
          <div className="w-[50%] ml-5">
            <p className="text-lg font-serif text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-sm font-serif text-gray-800">{user.location}</p>
            <p className="text-sm font-serif text-gray-800">{user.email}</p>
            <p className="text-sm font-serif text-gray-800">{user.phoneNumber}</p>
            <Rating rating={user.rating || 0} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center w-52 mt-10 text-white bg-black50 p-2 rounded-md shadow-3xl cursor-pointer"
            onClick={onClickUpdate}>
            <FaCameraRetro />
            <h1 className="ml-2">{selectedImage ? 'Save' : 'Update Photo'}</h1>
          </div>
          <input
            type="file"
            id="profilePicture"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="flex items-center justify-center w-52 mt-3 text-white bg-black50 p-2 rounded-md shadow-3xl cursor-pointer"
            onClick={handleAccountSetting}>
            <RiUserSettingsFill />
            <h1 className="ml-2">Account Setting</h1>
          </div>
        </div>
        <p className="mb-7 text-red-600 text-center"> {errorMessage}</p>
      </div>
      {/* Section 2 */}
      <div>

      </div>
        {/* Modal */}
        <SuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModel}
        title="Successfully Updated!"
      >
        <p className="text-gray-700">
          Your Profile picture Has Been Successfully Updated!
        </p>
      </SuccessModal>
    </div>
  )
}

export default Profile;