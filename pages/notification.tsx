'use client';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import { UserContext } from "@/context/UserContext";
import Pagination from "@/Components/Helper/Pagination";
import NotificationBar from "@/Components/Helper/NotificationBar";
import { FaTrash } from "react-icons/fa";

const Notification = () => {
  const router = useRouter();
  const { user } = useContext(UserContext)!;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  console.log(notifications, 'notifications')
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let response;
      response = await axios.get(`https://www.offerboats.com/notification/getNotifications/${user?._id}`);
      const sortedNotifications = response.data.notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(sortedNotifications);
    } catch (error) {
      setErrorMessage("You have no reviews yet!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchNotifications();
  }, [user]);

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNotificationClick = async (item: any) => {
    const { offer } = item?.data || {};
    try {
      // Mark notification as read
      await axios.put(`https://www.offerboats.com/notification/markNotificationAsRead/${item._id}`);

      if (item.title === 'New Booking Request') {
        const bookingId = item.data._id;
        const bookingResponse = await axios.get(`https://www.offerboats.com/notification/getBookingData/${bookingId}`);
        const bookingData = bookingResponse.data;
        router.push({
          pathname: '/trip-details',
          query: { booking: encodeURIComponent(JSON.stringify(bookingData)) },
        });
      }
      else if (
        item.title === 'Boat Request Rejected' ||
        item.title === 'Boat Request Accepted' ||
        item.title === 'Booking Request Accepted' ||
        item.title === 'Booking Request Rejected'
      ) {
        router.push({
          pathname: '/trip-details',
          query: { booking: encodeURIComponent(JSON.stringify(item.data)) },
        });
      }
      else if (item.title === 'New Boat Request') {
        const offerId = item.data._id;
        const offerCheckResponse = await axios.get(`https://www.offerboats.com/notification/checkOfferExists/${offerId}`);
        const offerExists = offerCheckResponse.data.exists;
        if (offerExists){
        const payload = {
          ...item.data,
          type: "BoatRequest",
        };
        router.push({
          pathname: '/boat-details',
          query: { tripDetails: encodeURIComponent(JSON.stringify(payload)) },
        });
      } else {
        router.push({
          pathname: `/app/${item.data.listingId}`,
        });
      }
      }
      else if (
        item.title === 'New Review Received' ||
        item.title === 'New Reply Received'
      ) {
        router.push({
          pathname: '/reviews',
        });
      }
      else if (item.title === 'New Message Received') {
        router.push({
          pathname: '/get-help',
        });
      }
      else {
        console.warn('No navigationId provided or unknown notification title:', item.title);
      }
    }
    catch (err) {
      console.log('Failed to handle notification press', err);
    }
  };


  const handleClearAll = async () => {
    if (!user._id) return;
    try {
      await axios.delete(`https://www.offerboats.com/notification/deleteNotifications/${user._id}`);
      fetchNotifications();
    } catch (err) {
      console.log('Failed to clear notifications', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="flex justify-between">
        <h1 className="heading my-3 text-center w-[88%]">Reviews</h1>
        <button className="flex flex-col items-center justify-center text-red-600 h-[3.5rem] w-[10%]"
          onClick={handleClearAll}>
          <FaTrash />
          <p className="text-xs">Clear All</p>
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && errorMessage && (
        <div className="text-center text-gray-500">
          <p>{errorMessage}</p>
        </div>
      )}
      {!loading &&
        paginatedNotifications.map((notification) => {
          const createdAtDate = new Date(notification.createdAt);
          const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          const date = createdAtDate.toLocaleDateString();
          const messageId = notification.data.messageId
          return (
            <NotificationBar
              key={notification._id}
              item={notification}
              onClick={() => handleNotificationClick(notification)}
              senderImage={user?.userType === 'BoatOwner' ? notification.userId.profilePicture : notification.ownerId.profilePicture}
              title={user?.userType === 'BoatOwner' && messageId ? `${notification.title} by OfferBoat` : user?.userType === 'BoatRenter' && messageId ? `${notification.title} by OfferBoat` : user?.userType === 'BoatOwner' ? `${notification.title} by ${notification.userId.firstName} ${notification.userId.lastName}` : `${notification.title} by ${notification.ownerId.firstName} ${notification.ownerId.lastName}`}
              body={notification.body}
              time={time}
              date={date}
              status={notification.read}
            />
          )
        })}

      {/* Pagination */}
      <Pagination
        totalItems={notifications.length}
        itemsPerPage={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Notification;
