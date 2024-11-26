import "@/styles/globals.css";
import "@/styles/styles.css";
import type { AppProps } from "next/app";
import Navbar from "@/Components/Navbar"; 
import MobileNav from "@/Components/MobileNav"; 
import Footer from "@/Components/Footer";
import React, { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [nav, setNav] = useState(false);

  const openNavHandler = () => setNav(true);
  const closeNavHandler = () => setNav(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Persistent Navbar */}
      <MobileNav nav={nav} closeNav={closeNavHandler} />
      <Navbar openNav={openNavHandler} />
      
      {/* Page-specific content */}
      <main className="flex-grow pt-[12vh]">
        <Component {...pageProps} />
      </main>
      
      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
