import Pagination from "@/Components/Helper/Pagination";
import TransactionRow from "@/Components/Helper/TransactionRow";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const Transactions = () => {
  const { user } = useContext(UserContext)!;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); 

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/payment/transactions`, {
        params: { userId: user._id },
      });
      const fetchedTransactions = Array.isArray(response.data) ? response.data : [];
      setTransactions(fetchedTransactions);
    } catch (error: any) {
      setErrorMessage(`You Don't Have Any Transaction History Yet!`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user._id]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="bg-white">
      <h1 className="heading my-3">Transactions</h1>
      {/* Render message if no transactions */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-800 text-center mt-4">
            {errorMessage || `You Don't Have Any Transaction History Yet!`}
          </p>
        </div>
      ) : (
        currentTransactions.map((item: any, index) => (
          <TransactionRow
            key={index}
            date={new Date(item.created * 1000).toLocaleDateString()}
            time={new Date(item.created * 1000).toLocaleTimeString()}
            price={(item.amount / 100).toFixed(2)}
            transactionStatus={
              item.status === 'succeeded'
                ? 'Success'
                : item.status === 'requires_capture'
                ? 'Hold'
                : item.status === 'canceled'
                ? 'Cancelled'
                : 'Failed'
            }
            onPress={() => {}}
          />
        ))
      )}
      {/* Pagination */}
      <Pagination
        totalItems={transactions.length}
        itemsPerPage={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Transactions;
