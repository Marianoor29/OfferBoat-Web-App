"use client";
import { UserContext } from "@/context/UserContext";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FaBell, FaChevronDown, FaChevronUp, FaShip,} from "react-icons/fa";
import LocationSearchBox from "./Helper/LocationSearch";
import { useRouter } from "next/navigation"; 
import { FaCircleDollarToSlot, FaCircleUser, FaMoneyCheckDollar } from "react-icons/fa6";
import { IoBoatSharp, IoCreate, IoLogOut } from "react-icons/io5";
import { MdPlaylistAddCheckCircle, MdReviews } from "react-icons/md";
import { PiListFill, PiHeartFill, PiListPlusFill } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { RiUserSettingsFill } from "react-icons/ri";
import axios from "axios";

interface Props {
  openNav: () => void;
  location: boolean;
  profile: boolean;
  setAddress: (address: string) => void;
  handleSearch: () => void;
}

const Navbar = ({ openNav, location = false, profile = true, setAddress, handleSearch }: Props) => {
  const router = useRouter(); 
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, clearUser } = useContext(UserContext)!;
  const [numberOfNotifications, setNumberOfNotifications] = useState(0);

  const handleLogout = () => {
    clearUser();
    router.push("/auth/login"); 
  };
console.log(numberOfNotifications, 'numberOfNotifications')
  const navigate = (path: string) => {
    router.push(path); 
    setOpen(false)
    setProfileMenuOpen(false)
  };

  const fetchNumberOfNotifications = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/notification/countUnreadNotifications/${user._id}`);
      if (response.status === 200) {
        setNumberOfNotifications(response.data.count);
      } else {
        console.log('Failed to fetch notification count:', response.status);
      }
    } catch (error) {
      console.log('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    if (user._id) {
      console.log('call')
    fetchNumberOfNotifications()
    }
  },[user._id])

  return (
    <div className="w-[100%] bg-white fixed top-0 left-0 right-0 z-[2000] shadow-lg">
      <div className="flex w-[95%] mx-auto items-center justify-between h-[12vh]">
        {/* Logo for large screens */}
        <div
          onClick={() => navigate("/")}
          className="relative w-[70px] h-[70px] lg:w-[150px] lg:h-[40px] cursor-pointer object-contain mb-3 mt-3 lg:block hidden"
        >
          <Image
            src="/images/logo.png"
            alt="Boat Rentals & Yacht Charters"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Logo for small screens */}
        <div
          onClick={() => navigate("/")}
          className="relative w-[70px] h-[70px] cursor-pointer object-contain mb-3 mt-3 lg:hidden"
        >
          <Image
            src="/images/logoHat.png"
            alt="Boat Rentals & Yacht Charters"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {location && (
          <LocationSearchBox setAddress={setAddress} onSearch={handleSearch} />
        )}

        <div className="flex justify-between items-center lg:space-x-12 md:space-x-12 relative">
          {/* Explore with Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="drop-nav-link lg:flex lg:flex-row justify-between items-center"
              onClick={() => setOpen((prev) => !prev)}
            >
              Explore
              <span className="ml-2">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            {/* Dropdown */}
            {open && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-48">
                <ul className="py-2">
                  <li onClick={() => navigate("/boats")} 
                  className="items-center flex-row flex px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                     <FaShip className="mr-2 text-black" />
                    Boats
                  </li>
                  <li onClick={() => navigate("/offers")} 
                  className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                 <FaMoneyCheckDollar className="mr-2 text-black" />
                    Offers
                  </li>
                  {user?.token && (
                    <>
                      {user?.userType === "BoatOwner" && (
                        <>
                          <li onClick={() => navigate("/owner/listings")} 
                          className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            <PiListFill className="mr-2 text-black" /> 
                            Listings
                          </li>
                          <li onClick={() => navigate("/owner/add-boat")} 
                          className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            <PiListPlusFill className="mr-2 text-black" />
                            Add Listing
                          </li>
                          <li onClick={() => navigate("/owner/submitted-boats")} 
                          className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            <IoBoatSharp className="mr-2 text-black" />
                            Submitted Boats
                          </li>
                        </>
                      )}
                      {user?.userType === "BoatRenter" && (
                        <>
                          <li onClick={() => navigate("/renter/make-offer")} 
                          className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                          <IoCreate  className="mr-2 text-black" />
                            Make Offer
                          </li>
                          <li onClick={() => navigate("/renter/my-offers")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                          <FaCircleDollarToSlot className="mr-2 text-black" />
                            My Offer
                          </li>
                        </>
                      )}
                      <li onClick={() => navigate("/trips")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                      <MdPlaylistAddCheckCircle className="mr-2 text-black" />
                        Trips
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* About us & Contact Page */}
          <ul className="py-2 flex justify-between items-center space-x-12">
            <li onClick={() => navigate("/about-us")} className="nav-link">
              About Us
            </li>
            <li onClick={() => navigate("/contact")} className="nav-link">
              Contact
            </li>
          </ul>

          {/* Render different menus based on authentication */}
          {user?.token && profile ? (
            <div className="relative">
              <div className="absolute right-2 -top-1 w-5 h-5 rounded-full bg-red-600 justify-center items-center flex">
               <p className="text-white text-xs">{numberOfNotifications}</p> 
              </div>
              {/* Profile Picture */}
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center focus:outline-none mr-5"
              >
                <Image
                  src={
                    user?.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Offerboat - Your Budget, Our Boats"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                  <p className="pl-3">Hi {user?.firstName || "There"}</p>
                  <ul className="py-2">
                    <li onClick={() => navigate("/profile")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    <FaCircleUser className="mr-2 text-black" />
                      View Profile
                    </li>
                    <li onClick={() => navigate("/notification")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    <FaBell className="mr-2 text-black" />
                      Notifications
                    </li>
                    {user?.userType === "BoatRenter" && (
                      <>
                        <li onClick={() => navigate("/renter/transaction")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                        <GrTransaction className="mr-2 text-black" />
                          Transactions
                        </li>
                      </>
                    )}
                    <li onClick={() => navigate("/renter/favorites")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    <PiHeartFill className="mr-2 text-black" />
                      Favorites
                    </li>
                    <li onClick={() => navigate("/reviews")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    <MdReviews className="mr-2 text-black" />
                      Reviews
                    </li>
                    <li onClick={() => navigate("/account-settings")} className="items-center flex-row flex  px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    <RiUserSettingsFill className="mr-2 text-black" />
                      Account Settings
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="items-center flex-row flex  w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer "
                      >
                      <IoLogOut className="mr-2 text-black" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
           <></>
          )}
        {!user.token && (
           <button onClick={() => navigate("/auth/login")} className="nav-link">
           SignIn
         </button>
        )}
          {/* Hamburger Icon */}
          <Bars3Icon onClick={openNav} className="w-[2rem] lg:hidden h-[2rem] text-blue-800 font-bold" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
