import React from 'react';
import { FaCheckCircle, FaPauseCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const TransactionRow = ({
  date = '',
  time = '',
  price = '',
  transactionStatus = '',
  onPress = () => {}
}) => {
  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'Success':
        return <FaCheckCircle className="text-green-500" size={20} />;
      case 'Cancelled':
        return <FaExclamationCircle className="text-red-500" size={20} />;
      case 'Hold':
        return <FaPauseCircle className="text-gray-500" size={20} />;
      default:
        return <FaTimesCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 bg-white mb-1 rounded-lg shadow cursor-pointer hover:bg-gray-50"
      onClick={onPress}
    >
      <div className="flex items-center gap-4">
        {getStatusIcon()}
        <div>
          <p className="text-lg font-semibold truncate">Booking Fee</p>
          <p className="text-sm text-gray-500">{date} - {time}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold">${price}</p>
        <p
          className={
            `text-sm font-medium ${
              transactionStatus === 'Success' ? 'text-green-500' :
              transactionStatus === 'Hold' ? 'text-gray-500' :
              'text-red-500'
            }`
          }
        >
          {transactionStatus}
        </p>
      </div>
    </div>
  );
};

export default TransactionRow;
