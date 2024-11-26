import CustomerReviews from "@/Components/Helper/CustomerReviews";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import Image from "next/image";
import Reviews from "@/Components/Reviews";
import PhotosSlider from "@/Components/Helper/PhotosSlider";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3, 
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2, 
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1, 
  },
};

const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="relative bg-white text-black py-16 px-8 lg:py-24 lg:px-16">
        <div className="container mx-auto flex items-center gap-8">
          <div className="w-full space-y-4">
            <h1 className="heading text-[35px]">
              Welcome to Offerboat
            </h1>
            <p className="text-lg leading-relaxed text-center">
              Offerboat – The Marketplace for Boat Rentals</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        {/* Section 1 */}
        <section className="flex flex-col md:flex-row items-center gap-6 my-10">
          <div className="md:w-1/2 lg:mr-10">
            <h2 className="heading text-start mb-3 text-[20px]">
              Our Vision
            </h2>
            <p className="text-lg text-justify">
              We connect boat owners and renters directly, cutting out the middleman, so you can focus on what matters—experiencing unforgettable moments on the water. Whether you’re planning a day of adventure, relaxation, or celebration, Offerboat is here to make your dream a reality.
            </p>
          </div>
          <div className="md:w-1/2 lg:ml-10">
            <Image
              src="/images/a1.jpeg"
              alt="Vision"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>
        {/* Mission Section */}
        <section className="flex flex-col py-16 px-8 lg:px-16 bg-blue-200 my-20">
          <div className="w-full space-y-8">
            <h2 className="text-lg leading-relaxed text-blue-900 font-semibold text-center">
              Our Mission
            </h2>
            <RiDoubleQuotesL size={40} color="#1e3a8a" />
            <p className="heading">
              Offerboat was created with one goal in mind, to make boating accessible, seamless, and fun for everyone.            </p>
            <div className="flex justify-end">
              <RiDoubleQuotesR size={40} color="#1e3a8a" />
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col md:flex-row-reverse items-center gap-6 my-10 bg-secondary bg-opacity-10 p-6 rounded-lg">
          <div className="md:w-1/2">
            <h2 className="heading text-start mb-3 text-[20px]">
              A Reliable Platform for Seamless Boat Rentals
            </h2>
            <p className="text-lg text-justify">
              For boat owners, Offerboat offers a transparent platform with no hidden fees, instant payments, and the freedom to negotiate directly with renters. For renters, we bring you the best deals, real-time listings, and the chance to explore the seas on your terms.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/a2.jpeg"
              alt="Mission"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>
        
        {/* Image Grid */}
        <section className="mt-20 mb-10">
          <h2 className="heading mb-10 text-[20px]">
          Celebrating the thrill of discovery and the beauty of togetherness, wherever your journey takes you
          </h2>
          <Carousel
        responsive={responsive}
        infinite
        showDots={true} // Optional: adds navigation dots
        containerClass="carousel-container"
        itemClass="item"
        className="rounded-lg" 
      >
        {["a3.jpeg", "a4.jpeg", "a5.jpeg", "a6.jpeg", "a8.jpeg", "a9.jpeg", "a10.jpeg", "a11.jpeg"].map(
          (img, index) => (
            <div key={index} className="relative">
              <Image
                src={`/images/${img}`}
                alt={`Journey image ${index + 1}`}
                width={400}
                height={200}
                className="rounded-lg object-cover" 
              />
            </div>
          )
        )}
      </Carousel>
        </section>

      {/* User Experience Section */}
        <section className="py-16 mb-10">
          <div className="container mx-auto text-center space-y-12">
            <h2 className="heading text-[20px]">
            Genuine Reviews from Both Sides of the Boat
            </h2>
            <CustomerReviews />
          </div>
        </section>

        {/* Mobile App Section */}
        <section>
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/1 relative">
              <div className="w-[300px] h-[600px] mx-auto relative">
                <Image
                  src="/images/mockup1.png"
                  alt="Mobile App"
                  layout="fill"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/1 space-y-6 text-center lg:text-left">
              <h2 className="heading text-[20px] text-start">
              On-the-Go Boating Made Easy – Get Our App!
              </h2>
              <p className="text-lg leading-relaxed text-black">
              Experience a smoother, faster, and more personalized boating adventure with our app!
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <a
                  href="https://apps.apple.com/gb/app/offerboat-boat-rentals/id6737234901"
                  className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-900"
                >
                  Get on Google Play
                </a>
                <a
                  href="https://apps.apple.com/gb/app/offerboat-boat-rentals/id6737234901"
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
                >
                  Download on App Store
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage;
