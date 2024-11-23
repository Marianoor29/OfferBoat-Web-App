import Contact from "@/Components/Contact";
import Hero from "@/Components/Hero";
import Reviews from "@/Components/Reviews";
import TopDestination from "@/Components/TopDestination";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const HomePage = () => {

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
      <Hero />
      <TopDestination />
      {/* <Hotels /> */}
      {/* <Boats /> */}
      <Reviews />
      <Contact />
    </div>
  );
};

export default HomePage;
