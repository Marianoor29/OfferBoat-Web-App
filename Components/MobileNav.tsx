"use client";
import { UserContext } from "@/context/UserContext";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useContext, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {
  nav: boolean;
  closeNav: () => void;
}

const MobileNav = ({ nav, closeNav }: Props) => {
  const [openExplore, setOpenExplore] = useState(false);
  const navAnimation = nav ? "translate-x-0" : "translate-x-[-100%]";
  const { user, clearUser } = useContext(UserContext)!;
  const router = useRouter();

   const handleNavigation = (path: string) => {
    closeNav(); 
    router.push(path); 
  };

  return (
    <div
      className={`fixed ${navAnimation} transform transition-all duration-300 top-0 left-0 right-0 bottom-0 z-[10000] bg-[#324e8b]`}
    >
   <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
        {/* Explore with Dropdown on Mobile */}
        <div className="relative">
          <button
            type="button"
            className="drop-nav-link-mobile flex flex-row justify-between items-center"
            onClick={() => setOpenExplore((prev) => !prev)}
          >
            Explore
            <span className="ml-2 ">
                {openExplore ? <FaChevronUp /> : <FaChevronDown />}
              </span>
          </button>

          {/* Mobile Dropdown */}
          {openExplore && (
            <div className="top-full left-0 mt-2 w-48">
              <ul className="py-2">
                <li>
                <button
                    className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                    onClick={() => handleNavigation("/boats")}
                  >
                    Boats
                  </button>
                </li>
                <li>
                <button
                    className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                    onClick={() => handleNavigation("/offers")}
                  >
                    Offers
                  </button>
                </li>
                {user?.token && (
                    <>
                      {user?.userType === "BoatOwner" ? (
                        <>
                          <li>
                          <button
                            className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                            onClick={() => handleNavigation("/owner/listings")}
                          >
                            Listings
                          </button>
                          </li>
                          <li>
                          <button
                            className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                            onClick={() => handleNavigation("/owner/add-boat")}
                          >
                            Add Listing
                          </button>
                          </li>
                          <li>
                          <button
                            className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                            onClick={() =>
                              handleNavigation("/owner/submitted-boats")
                            }
                          >
                            Submitted Boats
                          </button>
                          </li>
                        </>
                      ) :
                      user?.userType === "BoatRenter" && (
                          <>
                            <li>
                            <button
                              className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                              onClick={() => handleNavigation("/renter/make-offer")}
                            >
                              Make Offer
                            </button>
                            </li>
                            <li>
                            <button
                              className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                              onClick={() => handleNavigation("/renter/my-offers")}
                            >
                              My Offers
                            </button>
                            </li>
                          </>
                        )}
                      <li>
                      <button
                        className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                        onClick={() => handleNavigation("/trips")}
                      >
                        Trips
                      </button>
                      </li>
                    </>
                  )}
              </ul>
            </div>
          )}
        </div>
        {/* Other Links */}
        <button
          className="nav-link-mobile"
          onClick={() => handleNavigation("/about-us")}
        >
          About Us
        </button>
        <button
          className="nav-link-mobile"
          onClick={() => handleNavigation("/contact")}
        >
          Contact
        </button>
        {!user?.token && (
        <button
        className="nav-link-mobile"
        onClick={() => handleNavigation("/auth/login")}
      >
        Sign In
      </button>
        )}
      </div>

      <div
        onClick={closeNav}
        className="absolute cursor-pointer top-[2rem] z-[1000000] right-[2rem] w-[2rem] h-[2rem] text-white"
      >
        <XMarkIcon />
      </div>
    </div>
  );
};

export default MobileNav;