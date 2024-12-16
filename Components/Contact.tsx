import Image from "next/image";
import React from "react";

const Contact = () => {
  return (
    <div className="pt-[8rem] pb-[3rem] ">
      <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[2rem]">
        <div data-aos="fade-right" data-aos-delay="800">
          <Image
            src="/images/mockup4.png"
            alt="Boat Rentals & Yacht Charters"
            width={400}
            height={200}
            className="object-contain mx-auto "
          />
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="1000"
          className="flex items-center justify-center flex-col"
        >
          <h1 className="text-center w-[90%] xl:w-[70%] tracking-[0.1rem] mx-auto font-bold text-[20px] md:text-[30px] text-black">
          On-the-Go Boating Made Easy – Get Our App!
          </h1>
          <p className="mt-[0.7rem] w-[80%] xl:w-[60%] mx-auto text-center text-[15px] text-black opacity-70">
          Experience a smoother, faster, and more personalized boating adventure with our app!
          </p>
          <div className="flex mt-[3.4rem] rounded-lg mb-[3rem] items-center space-x-2 w-[80%] h-[4vh] md:h-[6.3vh]">
            <button className="ml-[1rem] px-4 py-2 rounded-lg">
            <Image src="/images/appStore.png" alt="Offerboat - appStore"     
            width={300}
            height={10}
            className="object-contain  mx-auto " />
            </button>
            <button className="ml-[1rem] px-4 py-2 rounded-lg">
            <Image src="/images/googlePlay.png" alt="Offerboat - googlePlay"    
            width={240}
            height={10}
            className="object-contain  mx-auto " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
