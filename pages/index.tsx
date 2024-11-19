import Contact from "@/Components/Contact";
import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import Hotels from "@/Components/Hotels";
import MobileNav from "@/Components/MobileNav";
import Navbar from "@/Components/Navbar";
import Reviews from "@/Components/Reviews";
import TopDestination from "@/Components/TopDestination";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; 
import Boats from "@/Components/Boats";

const HomePage = () => {
  const [nav, setNav] = useState(false);
  const openNavHandler = () => setNav(true);
  const closeNavHandler = () => setNav(false);

  // Now Deployment

  // Animation Setup (AOS)
  useEffect(() => {
    AOS.init({
      disable: false,
      startEvent: "DOMContentLoaded", 
      initClassName: "aos-init", 
      animatedClassName: "aos-animate", 
      useClassNames: false, 
      disableMutationObserver: false, 
      debounceDelay: 50, 
      throttleDelay: 99, 
      offset: 120, 
      delay: 0, 
      duration: 1000, 
      easing: "ease", 
      once: true, 
      mirror: false, 
      anchorPlacement: "top-bottom", 
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      <MobileNav nav={nav} closeNav={closeNavHandler} />
      <Navbar openNav={openNavHandler} />
      <Hero />
      <TopDestination />
      {/* <Hotels /> */}
      {/* <Boats /> */}
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
