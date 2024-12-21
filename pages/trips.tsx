import HeaderTab from "@/Components/Helper/HeaderTab";
import TripOrders from "@/Components/Helper/TripOrders";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
};

const Trips = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [bookings, setBookings] = useState<Trips[]>([]);
  const { user } = useContext(UserContext)!;
  const [selectedTopTab, setSelectedTopTab] = useState<string>("Current Trips");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previousPage, setPreviousPage] = useState<number>(1);

  const tabs = [
    { id: 1, name: "Current Trips" },
    { id: 2, name: "Previous Trips" },
  ];

  const onPressTab = (state: string) => {
    setSelectedTopTab(state);
    setCurrentPage(1);
    setPreviousPage(1);
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get(
        `https://www.offerboats.com/userBookings/${user._id}/${user.userType}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data) {
        const sortedListings = response.data.populatedBookings.sort(
          (a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          }
        );
        setBookings(sortedListings);
      }
    } catch (error) {
      setErrorMessage(`You Don't Have Any Bookings Yet!`);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTrips();
    }
  }, [user?.token]);

  const handleOnPress = (booking: any) => {
    router.push({
      pathname: '/trip-details',
      query: { booking: encodeURIComponent(JSON.stringify(booking)) },
  });
  };

  const handleOnFindBoat = () => {
    router.push(`/boats`);
  };

  const filterAndPaginateBookings = (statusFilters: string[], page: number) => {
    const filteredBookings = bookings.filter((b) =>
      statusFilters.includes(b.status)
    );
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    return filteredBookings.slice(startIndex, endIndex);
  };

  const currentBookings = filterAndPaginateBookings(
    ["Pending", "Accepted"],
    currentPage
  );
  const previousBookings = filterAndPaginateBookings(
    ["Completed", "Rejected"],
    previousPage
  );

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-gray-800 text-center mt-4">
          {errorMessage || `You Don't Have Any Bookings Yet!`}
        </p>
        <button
          className="bg-white text-emerald-600 px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 my-5 mx-7 font-serif"
          onClick={handleOnFindBoat}
        >
          Explore Boats and Book Your First Adventure on the Water
        </button>
      </div>
    );
  }

  return (
    <div>
      <HeaderTab
        tabs={tabs}
        onPress={onPressTab}
        selectedTopTab={selectedTopTab}
        selectedTabColor="bg-green-500"
      />

      {selectedTopTab === "Current Trips" && (
        <div>
          {currentBookings.length === 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-800 text-center mt-4">
                {pendingCount === 0
                  ? `You Don't Have Any Bookings Yet!`
                  : "No Accepted Bookings Yet!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
              {currentBookings.map((booking, index) => (
                <TripOrders
                  key={booking._id}
                  date={booking.date}
                  userName={
                    user.userType === "BoatRenter"
                      ? `${booking.ownerId.firstName} ${booking.ownerId.lastName}`
                      : `${booking.userId.firstName} ${booking.userId.lastName}`
                  }
                  address={booking.location}
                  price={booking.packages[0].price}
                  time={booking.time}
                  userImage={
                    user.userType === "BoatRenter"
                      ? booking.ownerId.profilePicture
                      : booking.userId.profilePicture
                  }
                  statusView={booking.status}
                  rating={
                    user.userType === "BoatRenter"
                      ? booking.ownerId.rating
                      : booking.userId.rating
                  }
                  onPressDetails={() => handleOnPress(booking)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {currentBookings.length > 0 && (
                <div className="flex gap-2 my-5 justify-center">
                <button
                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                  className="bg-renterBlue text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronLeft size={20} color="white" />
                </button>
                <button
                 onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                disabled={
                  currentPage * 20 >=
                  bookings.filter((b) => ["Pending", "Accepted"].includes(b.status)).length
                }
                  className="bg-renterBlue text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronRight size={20} color="white" />
                </button>
              </div>
          )}
        </div>
      )}

      {selectedTopTab === "Previous Trips" && (
        <div>
          {previousBookings.length === 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-800 text-center mt-4">
                You Don't Have Any Previous Bookings Yet!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] items-center w-[96%] mx-auto my-[2rem]">
              {previousBookings.map((booking, index) => (
                <TripOrders
                  key={booking._id}
                  date={booking.date}
                  userName={
                    user.userType === "BoatRenter"
                      ? `${booking.ownerId.firstName} ${booking.ownerId.lastName}`
                      : `${booking.userId.firstName} ${booking.userId.lastName}`
                  }
                  address={booking.location}
                  price={booking.packages[0].price}
                  time={booking.time}
                  userImage={
                    user.userType === "BoatRenter"
                      ? booking.ownerId.profilePicture
                      : booking.userId.profilePicture
                  }
                  statusView={booking.status}
                  rating={
                    user.userType === "BoatRenter"
                      ? booking.ownerId.rating
                      : booking.userId.rating
                  }
                  onPressDetails={() => handleOnPress(booking)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {previousBookings.length > 0 && (
                <div className="flex gap-2 my-5 justify-center">
                <button
                  onClick={() => setPreviousPage((prev) => Math.max(prev - 1, 1))}
                  disabled={previousPage === 1}
                  className="bg-renterBlue text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronLeft size={20} color="white" />
                </button>
                <button
                  onClick={() =>
                    setPreviousPage((prev) => prev + 1)
                  }
                  disabled={
                    previousPage * 20 >=
                    bookings.filter((b) => ["Completed", "Rejected"].includes(b.status)).length
                  }
                  className="bg-renterBlue text-white px-2 py-2 rounded-full shadow-md hover:bg-blue-700"
                >
                  <FaChevronRight size={20} color="white" />
                </button>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;
