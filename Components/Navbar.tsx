import { UserContext } from "@/context/UserContext";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LocationSearchBox from "./Helper/LocationSearch";

interface Props {
  openNav: () => void;
  location: boolean;
  setAddress?: (address: string) => void;
  handleSearch?: () => void;
}

const Navbar = ({ openNav, location = false, setAddress, handleSearch }: Props) => {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, clearUser } = useContext(UserContext)!;

  const handleLogout = () => {
    clearUser();
    window.location.href = "/auth/login";
  };

  return (
    <div className="w-[100%] bg-white fixed top-0 left-0 right-0 z-[2000] shadow-lg ">
      <div className="flex w-[95%] mx-auto items-center justify-between h-[12vh]">
        {/* Logo for large screens */}
        <Link
          href="/"
          className="relative w-[70px] h-[70px] lg:w-[150px] lg:h-[40px] cursor-pointer object-contain mb-3 mt-3 lg:block hidden"
        >
          <Image
            src="/images/logo.png"
            alt="Boat Rentals & Yacht Charters"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </Link>

        {/* Logo for small screens */}
        <Link
          href="/"
          className="relative w-[70px] h-[70px] cursor-pointer object-contain mb-3 mt-3 lg:hidden"
        >
          <Image
            src="/images/logoHat.png"
            alt="Boat Rentals & Yacht Charters"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {location && (
          <LocationSearchBox setAddress={setAddress} onSearch={handleSearch} />
        )}

        <div className="flex justify-between items-center lg:space-x-12 md:space-x-12 relative">
          {/* Explore with Dropdown */}
          <div className="relative ">
            <button
              type="button"
              className="drop-nav-link lg:flex lg:flex-row justify-between items-center"
              onClick={() => setOpen((prev) => !prev)}
            >
              Explore
              <span className="ml-2 ">
                {open ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {/* Dropdown */}
            {open && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-48">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/boats"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Boats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/offers"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Offers
                    </Link>
                  </li>
                  {user?.token && (
                    <>
                      {user?.userType === "BoatOwner" ? (
                        <>
                          <li>
                            <Link
                              href="/owner/listings"
                              className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => setOpen(false)}
                            >
                              Listings
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/owner/add-boat"
                              className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => setOpen(false)}
                            >
                              Add Listing
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/owner/submitted-boats"
                              className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => setOpen(false)}
                            >
                              Submitted Boats
                            </Link>
                          </li>
                        </>
                      ) :
                      user?.userType === "BoatRenter" && (
                          <>
                            <li>
                              <Link
                                href="/renter/make-offer"
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setOpen(false)}
                              >
                                Make Offer
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/renter/my-offers"
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setOpen(false)}
                              >
                                My Offer
                              </Link>
                            </li>
                          </>
                        )}
                      <li>
                        <Link
                          href="/trips"
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => setOpen(false)}
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
          {/* About us & Contact Page */}
          <ul className="py-2 flex justify-between items-center space-x-12 ">
            <li>
              <Link
                href="/about-us"
                className="nav-link"
              >
                AboutUs
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="nav-link"
              >
                Contact
              </Link>
            </li>
          </ul>
          {/* Render different menus based on authentication */}
          {user?.token && !location ? (
            <div className="relative">
              {/* Profile Picture */}
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center focus:outline-none mr-5"
              >
                <Image
                  src={user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt="Offerboat - Your Budget, Our Boats"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                  <p className="pl-3 ">Hi {user?.firstName || 'There'} </p>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        View Profile
                      </Link>
                    </li>
                    {/* {user?.userType === "BoatOwner" && (
                      <>
                        <li>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                          Dashboard
                          </Link>
                        </li>
                      </>
                    )} */}
                    {user?.userType === "BoatRenter" && (
                      <>
                        <li>
                          <Link
                            href="/renter/transaction"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Transactions
                          </Link>
                        </li>
                      </>
                    )}
                     <li>
                          <Link
                            href="/renter/favorites"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Favorites
                          </Link>
                        </li>
                    <li>
                      <Link
                        href="/reviews"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Reviews
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account-settings"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="nav-link">
              SignIn
            </Link>
          )}

          {/* Hamburger Icon */}
          <Bars3Icon
            onClick={openNav}
            className="w-[2rem] lg:hidden h-[2rem] text-blue-800 font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
