import Footer from "@/Components/Footer";
import MobileNav from "@/Components/MobileNav";
import Navbar from "@/Components/Navbar";
import { UserProvider } from "@/context/UserContext";
import "@/styles/globals.css";
import "@/styles/styles.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [nav, setNav] = useState(false);
  const router = useRouter();

  const openNavHandler = () => setNav(true);
  const closeNavHandler = () => setNav(false);

  const [address, setAddress] = useState<string>(""); 
  const handleSearch = () => {
    console.log(`Searching for: ${address}`);
  };

   // Define routes where the Navbar should not appear
   const noNavbarRoutes = ["/auth/email-verification", "/auth/choose-user-type",]; 
   const showNavbar = !noNavbarRoutes.includes(router.pathname);
 
    // Define routes where location search should be visible
    const locationRoutes = ["/boats", "/offers"];
    const showLocationSearch = locationRoutes.includes(router.pathname); 
  
     // Define routes where the Navbar should not appear
   const noFooterRoutes = ["/auth/email-verification", "/auth/choose-user-type"]; 
   const showFooter = !noFooterRoutes.includes(router.pathname);
 
  return (
    <UserProvider>
    <div className="flex flex-col min-h-screen">
   {/* Conditional Navbar Rendering */}
   {/* {showNavbar && (
        <>
      <MobileNav nav={nav} closeNav={closeNavHandler} />
      <Navbar 
        openNav={openNavHandler} 
        location={showLocationSearch} 
        setAddress={setAddress} 
        handleSearch={handleSearch} 
      />
        </>
      )} */}

      {/* Page-specific content */}
      <main className="flex-grow pt-[12vh]">
         <Component 
          {...pageProps} 
          address={address} 
          setAddress={setAddress} 
          handleSearch={handleSearch} 
        />
      </main>
      
      {/* Conditional Footer Rendering*/}
    {  showFooter && (
        <Footer />
      )
  }
    </div>
    </UserProvider>

  );
}
