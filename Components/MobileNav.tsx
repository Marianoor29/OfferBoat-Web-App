import { XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


interface Props {
  nav: boolean;
  closeNav: () => void;
}

const MobileNav = ({ nav, closeNav }: Props) => {
  const [openExplore, setOpenExplore] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navAnimation = nav ? "translate-x-0" : "translate-x-[-100%]";

  const handleLinkClick = () => {
    closeNav(); 
  };

  useEffect(() => {
    const { userInfo } = parseCookies();
    if (userInfo) {
      const parsedData = JSON.parse(userInfo);
      setToken(parsedData.token);
      setUserType(parsedData.userType);
    }
  }, []);

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
                  <Link
                    href="/boats"
                    className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                    onClick={handleLinkClick}
                  >
                    Boats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offers"
                    className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                    onClick={handleLinkClick}
                  >
                    Offers
                  </Link>
                </li>
                {token && (
                    <>
                      {userType === "BoatOwner" ? (
                        <>
                          <li>
                            <Link
                              href="/owner/listings"
                              className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                              onClick={handleLinkClick}
                            >
                              Listings
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/owner/add-boat"
                              className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                              onClick={handleLinkClick}
                            >
                              Add Listing
                            </Link>
                          </li>
                        </>
                      ) :
                        userType === "BoatRenter" && (
                          <>
                            <li>
                              <Link
                                href="/renter/make-offer"
                                className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                                onClick={handleLinkClick}
                              >
                                Make Offer
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/renter/my-offers"
                                className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                                onClick={handleLinkClick}
                              >
                                My Offer
                              </Link>
                            </li>
                          </>
                        )}
                      <li>
                        <Link
                          href="/trips"
                          className="block px-4 py-2 text-white hover:bg-gray-700 text-sm"
                          onClick={handleLinkClick}
                        >
                          Trips
                        </Link>
                      </li>
                    </>
                  )}
              </ul>
            </div>
          )}
        </div>
        {/* Other Links */}
        <Link href="/about-us" className="nav-link-mobile"  onClick={handleLinkClick}>About Us</Link>
        <Link href="/contact" className="nav-link-mobile"  onClick={handleLinkClick}>Contact</Link>
        {!token && (
        <Link href="/auth/login" className="nav-link-mobile" onClick={handleLinkClick}>
          Sign In
        </Link>
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