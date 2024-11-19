import SearchBox from "@/Components/Helper/SearchBox";
import Boats from "@/Components/Boats";
import MobileNav from "@/Components/MobileNav";
import Navbar from "@/Components/Navbar";
import React, { useState } from "react";

const BoatsPage = () => {
    const [nav, setNav] = useState(false);
    const openNavHandler = () => setNav(true);
    const closeNavHandler = () => setNav(false);
  return (
    <div className="overflow-x-hidden">
    <MobileNav nav={nav} closeNav={closeNavHandler} />
    <Navbar openNav={openNavHandler} />
    <SearchBox date={false}/>
    {/* <Boats /> */}
    </div>
  );
};

export default BoatsPage; 
