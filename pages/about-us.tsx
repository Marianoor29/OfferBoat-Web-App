import CustomerReviews from "@/Components/Helper/CustomerReviews";
import Image from "next/image";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

const AboutUsPage = () => {
  return (
    <div className="overflow-x-hidden bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-16 px-8 lg:py-24 lg:px-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Welcome to Our Company
            </h1>
            <p className="text-lg leading-relaxed">
              Offerboat – The Marketplace for Boat Rentals

              Looking for the best deals on boat rentals? Offerboat connects boat owners and renters in a vibrant, easy-to-use platform that brings direct communication, transparency, and upfront payments to the boating community.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center relative">
            {/* Animated Images */}
            <div className="relative w-[250px] h-[250px] lg:w-[300px] lg:h-[300px] animate-bounce">
              <Image
                src="https://offerboat-app-images.s3.amazonaws.com/listings/1729691016542_image_0.jpg"
                alt="Hero Animation 1"
                layout="fill"
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="absolute w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] top-10 right-10 animate-pulse">
              <Image
                src="/images/logoHat.png"
                alt="Hero Animation 2"
                layout="fill"
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Experience Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center space-y-12">
          <h2 className="heading">
            What Our Customers Say
          </h2>
          <CustomerReviews />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-8 lg:px-16 bg-blue-200">
        <div className="container mx-auto space-y-8">
          <h2 className="text-lg leading-relaxed text-blue-900 font-semibold text-center">
            Our Mission
          </h2>
          <RiDoubleQuotesL size={40} color="#1e3a8a" />
          <p className="heading">
            To connect boat owners and renters, offering great deals, direct negotiations, and secure upfront payments for a seamless boating experience.
          </p>
          <div className="flex justify-end">
            <RiDoubleQuotesR size={40} color="#1e3a8a" />
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Download Our Mobile App
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Enjoy exclusive features like instant notifications, personalized
              recommendations, and seamless booking—all from our app.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <a
                href="#"
                className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-900"
              >
                Get on Google Play
              </a>
              <a
                href="#"
                className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
              >
                Download on App Store
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="w-[300px] h-[600px] mx-auto relative">
              <Image
                src="/images/mockup1.png"
                alt="Mobile App"
                layout="fill"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutUsPage;
