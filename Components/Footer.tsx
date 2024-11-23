import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="pb-[2rem] pt-[7rem] bg-gray-100">
      <div className="w-[80%] mx-auto items-start grid grid-cols-1 border-b-2 pb-[2rem] md:grid-cols-2 lg:grid-cols-4 gap-[3rem] ">
        {/* First */}
        <div>
          <h1 className="footer__heading">Company</h1>
          <div>
            <a className="footer__link" href="#">
              About Us
            </a>
            <a className="footer__link" href="#">
              Careers
            </a>
            <a className="footer__link" href="#">
              Privacy policy
            </a>
            <a className="footer__link" href="#">
              Terms of Service
            </a>
          </div>
        </div>
        {/* Second */}
        <div>
          <h1 className="footer__heading">Contact</h1>
          <div>
            <a className="footer__link" href="#">
              FAQ
            </a>
            <a className="footer__link" href="#">
              Get in Touch
            </a>
          </div>
        </div>
          {/* 3rd */}
        <div>
          <h1 className="footer__heading">Social</h1>
          <div className="flex items-center space-x-4 text-white text-[1.3rem]">
            <div className="footer__icon bg-[#0165e1]">
              <FaFacebookF />
            </div>
            <div className="footer__icon bg-[#cd486b]">
              <FaInstagram />
            </div>
            <div className="footer__icon bg-[#cd201f]">
              <FaYoutube />
            </div>
          </div>
        </div>
        {/* 4th */}
        <div className="w-full ">
        <div className="flex justify-between items-start">
        <div>
            <Image src="/images/logoHat.png" alt="logo hat" width={50} height={50} className="object-contain" />
            </div>
          <div className="w-full">    
          <h3 className="text-black text-[13px] font-bold ml-5">OfferBoat - Boat Rentals App</h3>
          <p className="text-black text-[10px] ml-5">Download Our App Now!</p>
          </div>
          </div>
          <div className="flex items-center">
          <button>
            <Image src="/images/appStore.png" alt="logo hat"     
            width={132}
            height={30}
            className="object-contain mx-auto mr-3" />
            </button>
            <button >
            <Image src="/images/googlePlay.png" alt="logo hat"    
            width={117}
            height={20}
            className="object-contain  mx-auto" />
            </button>
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
