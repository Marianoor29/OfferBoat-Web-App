import { ReactNode } from "react";


type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }

 const SuccessModal = (
    {
     isOpen,
     onClose= () => null,
     title,
     children,
    }: ModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-500">{title}</h2>
          <div className="mb-6">{children}</div>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SuccessModal;