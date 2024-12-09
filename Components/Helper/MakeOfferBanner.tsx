import Image from "next/image";

const MakeOfferBanner = ({onClick}: any) => {
    return (
        <div className=" flex flex-col md:flex-row bg-blue-900 w-[90%] items-center lg:w-[70%] md:[80%] rounded-xl shadow-xl my-8">
            <div className="md:w-[40%] p-5 ">
                <h1 className="heading text-start mb-2 text-[20px] text-white">Publish Your Plans, Secure Your Ride</h1>
                <p className="text-start text-sm text-white mb-10 font-serif">Publish Your Budget and Preferences, Owners Will Match You With Their Best Boats. Pick The Boat That’s Perfect For You. It’s Your Journey, Your Choice.</p>
                <button
                onClick={onClick}
                 className="bg-white text-blue-900 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
                >
                    Publish Offer
                </button>
            </div>
            <div className=" md:w-[60%] pr-2 ">
            <Image
                    src="/images/offerBanner.png"
                    alt="Offerboat - Your Budget, Our Boats"
                    width={900}
                    height={780}
                    className="rounded-xl"
                />
            </div>
        </div>
    )
}

export default MakeOfferBanner;