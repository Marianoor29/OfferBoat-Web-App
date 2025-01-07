import Image from "next/image";
import { FC } from "react";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  senderImage: string;
};

type Props = {
  onClick?: (item: NotificationItem) => void;
  senderImage?: string;
  title?: string;
  body?: string;
  item: NotificationItem; // Pass the full item here
  time?: string;
  date?: string;
  status?: boolean;
};

const NotificationBar: FC<Props> = ({
  onClick,
  senderImage,
  title,
  body,
  item,
  time,
  date,
  status = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item); // Pass the item object to onClick
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center p-4 rounded-md cursor-pointer transition ${status ? "bg-gray-100" : "bg-gray-200"
        } hover:shadow-md mb-1`}
    >
      <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden">
        {senderImage && (
          <Image
            src={senderImage}
            alt="Offerboat - Your Budget, Our Boats"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
        )}
      </div>
      <div className="flex-1 ml-4 overflow-hidden">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{body}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{time}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
