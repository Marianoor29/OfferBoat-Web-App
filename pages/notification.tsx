'use client';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { UserContext } from "@/context/UserContext";
import ReviewDetailCard from "@/Components/ReviewDetailCard";
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

  const handleNotificationClick = (item: any) => {
    console.log("Notification clicked:", item);
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
          return(
          <NotificationBar
          key={notification.id}
          item={notification}
          onClick={handleNotificationClick}
          senderImage={user?.userType === 'BoatOwner' ? notification.userId.profilePicture : notification.ownerId.profilePicture }
          title={user?.userType === 'BoatOwner' && messageId ? `${notification.title} by OfferBoat` : user?.userType === 'BoatRenter' && messageId ? `${notification.title} by OfferBoat`: user?.userType === 'BoatOwner' ? `${notification.title} by ${notification.userId.firstName} ${notification.userId.lastName}`  : `${notification.title} by ${notification.ownerId.firstName} ${notification.ownerId.lastName}`}
          body={notification.body}
          time={time}
          date={date}
          status={notification.read}
        />
)})}

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
