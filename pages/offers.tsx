import LocationSearchBox from "@/Components/Helper/LocationSearch";
import { useState } from "react";

const OffersPage = () => {
  const [address, setAddress] = useState("Miami"); 
  const [triggerSearch, setTriggerSearch] = useState(true); 

  const handleSearch = () => {
    setTriggerSearch(true); 
  };
  
  return (
    <div className="overflow-x-hidden">
      <LocationSearchBox setAddress={setAddress} onSearch={handleSearch} />
    {/* <Offers /> */}
    </div>
  );
};

export default OffersPage; 
