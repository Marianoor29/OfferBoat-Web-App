import { Bars3Icon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  openNav: () => void;
}

const Navbar = ({ openNav }: Props) => {
  return (
    <div className="w-[100%] bg-white fixed top-0 left-0 right-0 z-[2000] shadow-lg">
      <div className="flex w-[95%] mx-auto items-center justify-between h-[12vh]">
         {/* Logo for large screens */}
         <div className="relative w-[70px] h-[70px] lg:w-[150px] lg:h-[40px] cursor-pointer object-contain mb-3 mt-3 lg:block hidden">
          <Image src="/images/logo.png" alt="logo" layout="fill" />
        </div>
        
        {/* Logo for small screens */}
        <div className="relative w-[70px] h-[70px] cursor-pointer object-contain mb-3 mt-3 lg:hidden">
          <Image src="/images/logoHat.png" alt="logo hat" layout="fill" />
        </div>
        <div className="flex items-center space-x-12">
        <Link href="/" className="nav-link">
            Explore
          </Link>
          <Link href="/boats" className="nav-link">
            Boats
          </Link>
          <Link href="/offers" className="nav-link">
            Offers
          </Link>
          <Link href="/about-us" className="nav-link">
            About Us
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
          <Link
            href="#"
            className="relative hidden lg:inline-flex items-center justify-center px-10 py-3 overflow-hidden font-medium tracking-tighter text-white bg-blue-900 rounded-lg group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-emerald-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-t from-transparent via-transparent to-blue-900"></span>
            <span className="relative">Sign up</span>
            </Link>
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
