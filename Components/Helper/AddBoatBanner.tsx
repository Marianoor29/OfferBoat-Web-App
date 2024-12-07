import Image from "next/image";

const AddBoatBanner = ({onClick} : any) => {
    return (
        <div className=" flex flex-col md:flex-row bg-emerald-600 w-[90%] items-center lg:w-[70%] md:[80%] rounded-xl shadow-xl my-8">
            <div className="md:w-[40%] p-5 ">
                <h1 className="heading text-start mb-2 text-[20px] text-white">Let’s Elevate Your Boating Business Together</h1>
                <p className="text-start text-sm text-white mb-10 font-serif">No Fees For Owners - Showcase Your Boats, Manage Bookings With Zero Cost, Attract More Customers, and Keep More of Your Earnings on a Global Boating Marketplace.</p>
                <button
                onClick={onClick}
                    className="bg-white text-emerald-600 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
                >
                    Add Your Boat
                </button>
            </div>
            <div className=" md:w-[60%] pr-2 ">
            <Image
                    src="/images/banner.png"
                    alt="Vision"
                    width={900}
                    height={780}
                    className="rounded-xl"
                />
            </div>
        </div>
    )
}

export default AddBoatBanner;