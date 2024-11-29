import FilterBox from "@/Components/Helper/FilterBox";
import OfferCard from "@/Components/Helper/OfferCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import useSWR from "swr";

// Fetch function for SWR
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500" />
  </div>
);

const BoatsPage = ({ address, setAddress, handleSearch }: { 
  address: string; 
  setAddress: (value: string) => void; 
  handleSearch: () => void; 
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { address: queryAddress } = router.query;
  const [triggerSearch, setTriggerSearch] = useState(true);
  const itemsPerPage = 20;
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [hours, setHours] = useState(1);
  const [captain, setCaptain] = useState("include");
  const [passengers, setPassengers] = useState(1);
  const [rating, setRating] = useState(0);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 3,
  });

  const swrKey = triggerSearch
    ? `https://www.offerboats.com/listing/listingsWithLocation?location=${address}&limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`
    : null;

  const { data: offersData, error } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (queryAddress) {
      setAddress(queryAddress as string); 
    } else {
      setAddress("Miami"); 
    }
    setTriggerSearch(true); 
  }, [queryAddress]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.96;
      const height = window.innerHeight * 0.8;

      let columnCount;
      if (window.innerWidth >= 1024) columnCount = 3;
      else if (window.innerWidth >= 768) columnCount = 2;
      else columnCount = 1;

      setDimensions({ width, height, columnCount });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const totalBoats = offersData?.totalCount || 0;
  const BoatsData = offersData?.listings || [];

  const handleOnPress = (id: string) => {
    router.push(`/app/${id}`);
  };

  const renderCell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * dimensions.columnCount + columnIndex;
    if (index >= BoatsData.length) return null;

    const item = BoatsData[index];

    return (
      <div style={style} key={item._id}>
        <OfferCard
          title={item.title}
          boatOwnerImage={item.boatOwnerImage}
          members={item.passengers}
          location={item.location}
          description={item.description}
          images={item.images}
          onPress={() => handleOnPress(item._id)}
        />
      </div>
    );
  };

  // Filter functions
  const handleRemoveFilters = () => {
    setPriceRange([0, 2000]);
    setHours(1);
    setCaptain("include");
    setPassengers(1);
    setRating(0);
  };

  const handleApplyFilters = () => {
    console.log({
      priceRange,
      hours,
      captain,
      passengers,
      rating,
    });
    alert("Filters applied!");
  };

  return (
    <div >
      <FilterBox
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        hours={hours}
        onHoursChange={setHours}
        captain={captain}
        onCaptainChange={setCaptain}
        passengers={passengers}
        onPassengersChange={setPassengers}
        rating={rating}
        onRatingChange={setRating}
        onApplyFilters={handleApplyFilters}
        onRemoveFilters={handleRemoveFilters}
      />
      <div className="mt-4 text-center">
        {(!offersData && !error) ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">Error loading data: {error.message || "Unknown error"}</div>
        ) : BoatsData.length === 0 ? (
          <div className="text-red-500">No Boats Found in {address}</div>
        ) : null}
      </div>
      <div className="pb-[1rem]">
        <div className="w-[96%] mx-auto mt-[1rem]">
          <Grid
            columnCount={dimensions.columnCount}
            columnWidth={dimensions.width / dimensions.columnCount}
            height={dimensions.height}
            rowCount={Math.ceil(BoatsData.length / dimensions.columnCount)}
            rowHeight={420}
            width={dimensions.width}
          >
            {renderCell}
          </Grid>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-4">
            {Array.from({ length: Math.ceil(totalBoats / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${page === index + 1
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-blue-900"
                  }`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatsPage;
