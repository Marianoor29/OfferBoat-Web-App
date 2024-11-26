import { OwnerFaqData } from "@/dummyData";
import { useState } from "react";


const OwnersFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle the open/close state of a specific FAQ
  const toggleFAQ = (index:any) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-primary text-black py-10">
          <div className="container mx-auto px-4">
          <h1 className="heading text-start mb-4">Owner's FAQ</h1>
            <p className="mt-2 lg:text-lg md:text-md text-sm ">
              Get answers to the most frequently asked questions about renting with Offerboat.
            </p>
          </div>
        </header>
  
        {/* FAQ Section */}
      <main className="container mx-auto px-4 py-10">
        {OwnerFaqData.map((faq, index) => (
          <div key={index} className="mb-6 border-b border-gray-300">
            <button
              className="flex justify-between items-center w-full py-4 text-left  heading lg:text-[20px] md:text-[18px] mb-4"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span
                className={`ml-2 transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openIndex === index && (
              <p className="lg:text-lg md:text-md text-sm mt-2 whitespace-pre-line mb-5">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </main>
  
        {/* Footer */}
        <footer className="bg-gray-200 py-6">
          <div className="container mx-auto text-center text-gray-600">
            © {new Date().getFullYear()} Offerboat. All rights reserved.
          </div>
        </footer>
      </div>
    );
  };
  
  export default OwnersFAQ;