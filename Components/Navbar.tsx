import { Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LocationSearchBox from "./Helper/LocationSearch";

interface Props {
  openNav: () => void;
  location: boolean;
  setAddress?: (address: string) => void;
  handleSearch?: () => void;
}

const Navbar = ({ openNav , location = false, setAddress, handleSearch}: Props) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="w-[100%] bg-white fixed top-0 left-0 right-0 z-[2000] shadow-lg">
      <div className="flex w-[95%] mx-auto items-center justify-between h-[12vh]">
        {/* Logo for large screens */}
        <Link  href="/" className="relative w-[70px] h-[70px] lg:w-[150px] lg:h-[40px] cursor-pointer object-contain mb-3 mt-3 lg:block hidden">
          <Image
            src="/images/logo.png"
            alt="Offerboat - Boat Rentals & Yacht Charters"
            layout="fill"
          />
        </Link>

        {/* Logo for small screens */}
        <Link  href="/"className="relative w-[70px] h-[70px] cursor-pointer object-contain mb-3 mt-3 lg:hidden">
          <Image
            src="/images/logoHat.png"
            alt="Offerboat - Boat Rentals & Yacht Charters"
            layout="fill"
          />
        </Link>
      {location && (
     <LocationSearchBox setAddress={setAddress} onSearch={handleSearch} />
      )}
        <div className="flex justify-between space-x-12 relative">
          {/* Explore with Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="drop-nav-link lg:flex lg:flex-row justify-between items-center"
              onClick={handleToggle}
            >
              Explore
              <span className="ml-2 ">
                {open ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {/* Dropdown */}
            {open && (
              <div
                className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-48" >
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
                 
                </ul>
              </div>
            )}
          </div>

          {/* Other links */}
          <Link href="/about-us" className="nav-link">
            AboutUs
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
          <Link href="/auth/login" className="nav-link">
            SignIn
          </Link>

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
