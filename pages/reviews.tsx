import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import ReviewDetailCard from "@/Components/ReviewDetailCard";
import Pagination from "@/Components/Helper/Pagination";

interface Review {
  userType: string;
  userId: string;
  bookingId: string;
  _id: string;
  createdAt: string;
  reviewText: string;
  rating: number;
  replies: any[];
  renterId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}

const Reviews = () => {
  const router = useRouter();
  const { user } = useContext(UserContext)!;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      let response;
        response = await axios.get(`https://www.offerboats.com/rating/getReviews`, 
       { params: { userId : user?._id, userType: user?.userType },
      });
      if (response.status === 200) {
        const reviewsData = Array.isArray(response.data) ? response.data : [response.data];
        reviewsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setReviews(reviewsData);
      } else {
        setErrorMessage("Failed to fetch reviews.");
      }
    } catch (error) {
      setErrorMessage("You have no reviews yet!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && user?.userType) fetchAllReviews();
  }, [user]);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReplySubmit = (ratingId: string, newReply: any) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === ratingId
          ? { ...review, replies: [...review.replies, newReply] }
          : review
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
       <h1 className="heading my-3">Reviews</h1>
      {loading && <p>Loading...</p>}
      {!loading && errorMessage && (
        <div className="text-center text-gray-500">
          <p>{errorMessage}</p>
        </div>
      )}
      {!loading &&
        paginatedReviews.map((review) => (
          <ReviewDetailCard
            key={review._id}
            reviewerName={
              user.userType === "BoatOwner"
                ? `${review.renterId.firstName} ${review.renterId.lastName}`
                : `${review.ownerId.firstName} ${review.ownerId.lastName}`
            }
            reviewerImage={
              user.userType === "BoatOwner" ? review.renterId.profilePicture : review.ownerId.profilePicture
            }
            reviewDate={new Date(review.createdAt).toLocaleDateString()}
            reviewText={review.reviewText}
            rating={review?.rating || 0}
            replies={review.replies}
            ratingId={review._id}
            bookingId={review.bookingId}
            ownerId={review.ownerId._id}
            userId={review.renterId._id}
            userType={user?.userType || ''}
            showReplyBox={true}
            onReplySubmit={handleReplySubmit}
          />
        ))}

      {/* Pagination */}
      <Pagination
        totalItems={reviews.length}
        itemsPerPage={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Reviews;
