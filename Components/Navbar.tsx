"use client";
import { UserContext } from "@/context/UserContext";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LocationSearchBox from "./Helper/LocationSearch";
import { useRouter } from "next/navigation"; 

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

  const handleLogout = () => {
    clearUser();
    router.push("/auth/login"); 
  };

  const navigate = (path: string) => {
    router.push(path); 
    setOpen(false)
    setProfileMenuOpen(false)
  };

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
                  <li onClick={() => navigate("/boats")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    Boats
                  </li>
                  <li onClick={() => navigate("/offers")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                    Offers
                  </li>
                  {user?.token && (
                    <>
                      {user?.userType === "BoatOwner" && (
                        <>
                          <li onClick={() => navigate("/owner/listings")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            Listings
                          </li>
                          <li onClick={() => navigate("/owner/add-boat")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            Add Listing
                          </li>
                          <li onClick={() => navigate("/owner/submitted-boats")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            Submitted Boats
                          </li>
                        </>
                      )}
                      {user?.userType === "BoatRenter" && (
                        <>
                          <li onClick={() => navigate("/renter/make-offer")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            Make Offer
                          </li>
                          <li onClick={() => navigate("/renter/my-offers")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                            My Offer
                          </li>
                        </>
                      )}
                      <li onClick={() => navigate("/trips")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
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
                    <li onClick={() => navigate("/profile")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                      View Profile
                    </li>
                    {user?.userType === "BoatRenter" && (
                      <>
                        <li onClick={() => navigate("/renter/transaction")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                          Transactions
                        </li>
                      </>
                    )}
                    <li onClick={() => navigate("/renter/favorites")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                      Favorites
                    </li>
                    <li onClick={() => navigate("/reviews")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                      Reviews
                    </li>
                    <li onClick={() => navigate("/account-settings")} className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ">
                      Account Settings
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer "
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
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
