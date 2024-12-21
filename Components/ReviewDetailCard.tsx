import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";

type ReviewItemProps = {
  reviewerName: string;
  reviewerImage: string;
  reviewDate: string;
  reviewText: string;
  rating: number;
  replies?: { replierName: string; replyText: string }[];
  ratingId: string;
  bookingId: string;
  ownerId: string;
  userId: string;
  userType: string;
  showReplyBox?: boolean;
  onReplySubmit: (ratingId: string, newReply: any) => void;
};

const ReviewDetailCard = ({
  reviewerName,
  reviewerImage,
  reviewDate,
  reviewText,
  rating,
  replies = [],
  ratingId,
  bookingId,
  ownerId,
  userId,
  userType,
  showReplyBox = false,
  onReplySubmit,
}: ReviewItemProps) => {
const { user } = useContext(UserContext)!;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const renderStars = () => {
    return (
      <>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <FaStar key={`full-${index}`} className="text-yellow-500" />
          ))}
        {halfStar && <FaStarHalf className="text-yellow-500" />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
          ))}
      </>
    );
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`https://www.offerboats.com/rating/addReply`, {
        ratingId,
        replierName: `${user.firstName} ${user.lastName}`,
        replyText,
        bookingId,
        ownerId,
        userId,
        userType,
      });

      if (response.status === 200) {
        const newReply = { replierName: `${user.firstName} ${user.lastName}`, replyText };
        onReplySubmit(ratingId, newReply);
        setReplyText("");
        setShowReplies(true);
      } else {
        console.error("Failed to submit reply.");
      }
    } catch (error) {
      console.error("An error occurred while submitting your reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 flex space-x-4">
      <img
        src={reviewerImage}
        alt={reviewerName}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="mb-7">
          <h3 className="text-lg font-semibold">{reviewerName}</h3>
          <p className="text-sm text-gray-500">{reviewDate}</p>
        </div>
        <div className="flex space-x-1 mt-1">{renderStars()}</div>
        <p className="text-gray-700 mt-2">
          {isExpanded ? reviewText : `${reviewText.substring(0, 100)}...`}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 ml-2"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </p>
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-500 mt-2"
          >
            {showReplies ? "Hide Replies" : "Show Replies"}
          </button>
        )}
        {showReplies && (
          <div className="mt-2 space-y-2">
            {replies.map((reply, index) => (
              <div key={index} className="pl-4 border-l-2 border-gray-200">
                <p className="text-gray-800 font-semibold">{reply.replierName}</p>
                <p className="text-gray-700">{reply.replyText}</p>
              </div>
            ))}
          </div>
        )}
        {showReplyBox && (
          <div className="mt-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSendReply}
              disabled={loading || replyText.trim() === ""}
              className={`mt-2 px-4 py-2 rounded-lg text-white ${
                loading || replyText.trim() === ""
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailCard;
