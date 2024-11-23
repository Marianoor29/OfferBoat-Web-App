import { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { useRouter } from "next/router";
import apiUrl from "@/pages/config";
import axios from "axios";
import useSWR from "swr";
import LocationSearchBox from "@/Components/Helper/LocationSearch";
import OfferCard from "@/Components/Helper/OfferCard";

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

const BoatsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [address, setAddress] = useState("Miami"); 
  const [triggerSearch, setTriggerSearch] = useState(true); 
  const itemsPerPage = 20;

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 3,
  });

  const swrKey = triggerSearch
    ? `${apiUrl}/listing/listingsWithLocation?location=${address}&limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`
    : null;

     const { data: offersData, error } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
    revalidateOnReconnect: true,
    shouldRetryOnError: false, 
  });
      
  useEffect(() => {
    if (address) {
      setTriggerSearch(true); 
    }
  }, []);

    useEffect(() => {
      const handleRouteChange = () => {
        const scrollableDiv = document.getElementById('scrollable-container');
        if (scrollableDiv) {
          scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
      router.events.on('routeChangeComplete', handleRouteChange);
  
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]); 

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

  const handleSearch = () => {
    setTriggerSearch(true); 
  };

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

  return (
   <div id="scrollable-container" className="overflow-x-hidden h-screen">
     <LocationSearchBox setAddress={setAddress} onSearch={handleSearch} />
      {/* Loader / Error / No Results message */}
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
                className={`px-4 py-2 rounded-md ${
                  page === index + 1
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
