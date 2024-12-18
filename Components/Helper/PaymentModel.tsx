import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FC, ReactNode, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  handlePayment: (stripe: any, elements: any, cardInfo: any) => void; 
  isProcessing?: boolean; 
}

const PaymentModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Yes",
  cancelText = "No",
  handlePayment,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const stripe = useStripe();
  const elements = useElements();

  const [showCardDetails, setShowCardDetails] = useState(false);

  const handlePayNow = () => {
    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded.");
      return;
    }
    const cardInfo = elements.getElement(CardElement); 
    if (cardInfo) {
      handlePayment(stripe, elements, cardInfo); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            {cancelText}
          </button>
            <button
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
              onClick={() => setShowCardDetails(true)}
            >
              {confirmText}
            </button>
        </div>
        <button
          className="mt-6 text-blue-600 underline focus:outline-none"
          onClick={() => setShowCardDetails(!showCardDetails)}
        >
          {showCardDetails ? "Hide Card Details" : "Enter Card Details"}
        </button>
        {showCardDetails && (
          <>
            <div className="mb-7">
              <h1 className="mb-2">Card Details</h1>
              <div className="border border-gray-300 rounded-lg p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <button
              onClick={handlePayNow}
              className={`mb-7 px-4 py-2 ${
                isProcessing ? "bg-gray-400" : "bg-blue-500"
              } text-white rounded-md hover:bg-blue-600 focus:outline-none`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
