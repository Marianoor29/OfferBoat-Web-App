import { sliderImages } from "@/dummyData";
import OfferCard from "./Helper/OfferCard";

const Boats = () => {
  return (
    <div className="pt-[5rem] bg-blue-100 pb-[4rem] ">
      <h1 className="heading">Boats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[85%] mx-auto mt-[2rem]">
        <div data-aos="fade-left">
        <OfferCard
        title="Luxury Yacht"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay"
        description="Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
        <div data-aos="zoom-in" data-aos-delay="300">
        <OfferCard
        title="Luxury Yacht"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay"
        description="Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
        <div data-aos="fade-right" data-aos-delay="600">
        <OfferCard
        title="Luxury Yacht"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay"
        description="Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
        <div data-aos="fade-left" data-aos-delay="900">
        <OfferCard
        title="Luxury Yacht Experience the ultimate luxury  Experience the ultimate"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay Experience the ultimate luxury  Experience the ultimate"
        description="Experience the ultimate luxury Experience the ultimate luxury Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
        <div data-aos="zoom-in" data-aos-delay="1200">
        <OfferCard
        title="Luxury Yacht"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay"
        description="Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
        <div data-aos="fade-right" data-aos-delay="1600">
        <OfferCard
        title="Luxury Yacht"
        boatOwnerImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        members={10}
        location="Marina Bay"
        description="Experience the ultimate luxury"
        images={sliderImages}
      />
        </div>
      </div>
    </div>
  );
};

export default Boats;
