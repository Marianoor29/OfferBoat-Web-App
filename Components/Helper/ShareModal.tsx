import Image from "next/image";
import React, { useState } from "react";
import { FaCopy, FaCross } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    EmailShareButton,
  } from "react-share";
  import {
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
    EmailIcon,
  } from "react-share";

  
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageUrl: string;
  pageTitle: string;
  location: string;
  src: any
}

export default function ShareModal({ isOpen, onClose, pageUrl, pageTitle , src, location}: ShareModalProps) {
  if (!isOpen) return null;
  const [showCopySuccessMessage, setCopySuccessMessage] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopySuccessMessage(true)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
       <div className="flex justify-between items-center mb-10">
        <h2 className="text-md font-serif">Share this boat</h2>
        <div className="flex items-center justify-center text-white bg-black50 h-[2rem] w-[2rem] rounded-3xl shadow-3xl cursor-pointer"
        onClick={onClose}>
        <IoClose />   
        </div>
        </div>
        <div className="flex justify-between mb-10 ">
        <Image
              src={src || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="Boat Rentals & Yacht Charters"
              width={90}
              height={50}
              className="rounded-md object-cover h-[80px]"
            /> 
        <div className="ml-5">
        <h1 className="heading text-sm text-left">{pageTitle}</h1>    
        <p className="text-sm text-left text-gray-500">{location}</p>    
       </div>    
        </div>
        <div className="flex justify-around mb-4 flex-wrap"> 
          <FacebookShareButton url={pageUrl} title={pageTitle}  className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer">
            <FacebookIcon size={32} round />
            <h1 className="text-md font-serif ml-5">Facebook</h1>
          </FacebookShareButton>
 
          <TwitterShareButton url={pageUrl} title={pageTitle} className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer"> 
            <TwitterIcon size={32} round />
            <h1 className="text-md font-serif ml-5">Twitter</h1>
          </TwitterShareButton>
  
          <WhatsappShareButton url={pageUrl} title={pageTitle} className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer">
            <WhatsappIcon size={32} round />
            <h1 className="text-md font-serif ml-5">Whatsapp</h1>
          </WhatsappShareButton>
  
          <LinkedinShareButton url={pageUrl} className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer">   
            <LinkedinIcon size={32} round />
            <h1 className="text-md font-serif ml-5">LinkedIn</h1>
          </LinkedinShareButton>
    
          <EmailShareButton url={pageUrl} subject={pageTitle} className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer">   
            <EmailIcon size={32} round />
            <h1 className="text-md font-serif ml-5">E-mail</h1>
          </EmailShareButton>
      
          <div className="flex w-[45%] items-center px-4 py-2 mt-5 cursor-pointer"
           onClick={copyToClipboard}>   
          <FaCopy />
          <h1 className="text-md font-serif ml-5">{showCopySuccessMessage ? 'Copied!' : 'Copy link' }</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
