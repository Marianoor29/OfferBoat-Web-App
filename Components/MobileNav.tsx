import { XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React from "react";


interface Props {
  nav: boolean;
  closeNav: () => void;
}

const MobileNav = ({ nav, closeNav }: Props) => {
  const navAnimation = nav ? "translate-x-0" : "translate-x-[-100%]";

  return (
    <div
      className={`fixed ${navAnimation} transform transition-all duration-300 top-0 left-0 right-0 bottom-0 z-[10000] bg-[#324e8b]`}
    >
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
        <Link href="/" className="nav-link-mobile">Explore</Link>
        <Link href="/boats" className="nav-link-mobile">Boat</Link>
        <Link href="/offers" className="nav-link-mobile">Offers</Link>
        <Link href="/about-us" className="nav-link-mobile">Review</Link>
        <Link href="/contact" className="nav-link-mobile">Contact</Link>
        <Link href="/auth/login" className="nav-link-mobile">SignIn</Link>
      
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
