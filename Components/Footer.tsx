import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-100 py-[2rem]">
      <div className="w-[80%] mx-auto items-start grid grid-cols-1 border-b-2 pb-[2rem] md:grid-cols-2 lg:grid-cols-4 gap-[3rem] ">
        {/* First */}
        <div>
          <h1 className="footer__heading">Company</h1>
          <div>
            <a className="footer__link" href="/about-us">
              About OfferBoat
            </a>
            <a className="footer__link" href="/app/privacy-policy">
              Privacy policy
            </a>
            <a className="footer__link" href="/app/termsConditions">
              Terms of Service
            </a>
          </div>
        </div>
        {/* Second */}
        <div>
          <h1 className="footer__heading">Contact</h1>
          <div>
            <a className="footer__link" href="/app/owners-faq">
              Owner's FAQ
            </a>
            <a className="footer__link" href="/app/renters-faq">
              Renter's FAQ
            </a>
            <a className="footer__link" href="/contact">
              Get in Touch
            </a>
          </div>
        </div>
          {/* 3rd */}
        <div>
          <h1 className="footer__heading">Social</h1>
          <div className="flex items-center space-x-4 text-white text-[1.3rem]">

            <a className="footer__icon bg-[#0165e1]" href="https://www.facebook.com/boatsnaps?mibextid=LQQJ4d&rdid=bf8ekfxzHDw6Z70q&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B3LNNyhij%2F%3Fmibextid%3DLQQJ4d#">
              <FaFacebookF />
            </a >
            <a className="footer__icon bg-[#cd486b]" href="https://www.instagram.com/boatsnaps.offerboat/profilecard/?igsh=ems2d3AzNWJudzRu">
              <FaInstagram />
            </a>
            <a className="footer__icon bg-[#1e0b0b]" href="https://www.tiktok.com/@offerboat?_t=8rijTSxXMap&_r=1">
            <FaTiktok />
            </a>
            <a className="footer__icon bg-[#cd201f]" href="https://www.youtube.com/@boatsnaps">
              <FaYoutube />
            </a>
            <a className="footer__icon bg-[#faf8f8]" href="https://x.com/boatsnaps">
            <Image
          src="/images/x-com.png"
          alt="x-com"
          width={230}
          height={230}
          className="object-contain sm:ml-auto"
        /> 
            </a>

          </div>
        </div>
        {/* 4th */}
        <div className="w-full ">
        <div className="flex justify-between items-start">
        <div>
            <Image src="/images/logoHat.png" alt="Offerboat - Boat Rentals & Yacht Charters" width={50} height={50} className="object-contain" />
            </div>
          <div className="w-full">    
          <h3 className="text-black text-[13px] font-bold ml-5">OfferBoat - Boat Rentals App</h3>
          <p className="text-black text-[10px] ml-5">Download Our App Now!</p>
          </div>
          </div>
          <div className="flex items-center">
          <a href="https://apps.apple.com/gb/app/offerboat-boat-rentals/id6737234901">
          <button>
            <Image src="/images/appStore.png" alt="Offerboat - Boat Rentals & Yacht Charters"     
            width={132}
            height={30}
            className="object-contain mx-auto mr-3" />
            </button>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.OfferBoat">
            <button >
            <Image src="/images/googlePlay.png" alt="Offerboat - Boat Rentals & Yacht Charters"    
            width={117}
            height={20}
            className="object-contain  mx-auto" />
            </button>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-[1rem] grid grid-cols-1 gap-[1.4rem] sm:grid-cols-2 justify-between w-[80%] mx-auto">
        <p className="text-[17px] text-black opacity-60 font-semibold">
          &#169; Copyright OfferBoat Partners LLC
        </p>
        {/* <Image
          src="/images/pay.svg"
          alt="pay"
          width={230}
          height={230}
          className="object-contain sm:ml-auto"
        /> */}
      </div>
    </div>
  );
};

export default Footer;
