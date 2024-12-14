import HeaderTab from "@/Components/Helper/HeaderTab";
import TripOrders, { ORDER_STATUSES } from "@/Components/Helper/TripOrders";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";

type Trips = {
  _id: string;
  date: string;
  createdAt: string;
  time: string;
  status: string;
  location: string;
  userId: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    location: string;
    rating: number;
  };
  listingId: {
    location: string;
    title: string;
    images: string[]
  };
  ownerId: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    rating: number;
    location: string;
  };
  packages: {
    price: number;
  }[];
}

const Trips = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [bookings, setBookings] = useState<Trips[]>([])
  const { user } = useContext(UserContext)!;
  const [selectedTopTab, setSelectedTopTab] = useState<string>("Current Trips");
  const [currentTabArray, setCurrentTabArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPagesCurrent, setTotalPagesCurrent] = useState(0);
  const [totalPagesPrevious, setTotalPagesPrevious] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 3,
  });
  console.log(bookings, 'bookings')
  const tabs = [
    { id: 1, name: "Current Trips" },
    { id: 2, name: "Previous Trips" },
  ];

  const onPressTab = (state: string) => {
    setSelectedTopTab(state);
  };

  const fetchTrips = async () => {
    try {
        const response = await axios.get(`https://www.offerboats.com/userBookings/${user._id}/${user.userType}`,{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log(response)
      if (response.data) {
        // Sort listings by `createdAt` in descending order
        const sortedListings = response.data.populatedBookings.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setBookings(sortedListings)
      }
    }
    catch (error) {
      setErrorMessage(`You Don't Have Any Listings Yet!`)
      setBookings([]);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTrips();
    }
  }, [user?.token]);


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

  const handleOnPress = (booking: any) => {
    const serializedOffer = encodeURIComponent(JSON.stringify(booking));
    router.push(`/trip-details?booking=${serializedOffer}`);
  };

  return (
    <div>
      <HeaderTab
        tabs={tabs}
        onPress={onPressTab}
        selectedTopTab={selectedTopTab}
        selectedTabColor="bg-green-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
        {bookings.map((booking, index) => (
          <TripOrders
            key={booking._id}
            date={booking.date}
            userName={
              user.userType === 'BoatRenter' ?
                `${booking.ownerId.firstName} ${booking.ownerId.lastName}` :
                `${booking.userId.firstName} ${booking.userId.lastName}`}
            address={booking.location}
            price={booking.packages[0].price}
            time={booking.time}
            userImage={
              user.userType === 'BoatRenter' ?
                booking.ownerId.profilePicture :
                booking.userId.profilePicture}
            statusView={booking.status}
            rating={
              user.userType === 'BoatRenter' ?
                booking.ownerId.rating :
                booking.userId.rating}
            onPressDetails={() => handleOnPress(booking)}
          />
        ))}
      </div>
    </div>
  )
}

export default Trips;