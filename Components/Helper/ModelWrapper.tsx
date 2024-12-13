import { FC, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  if (!isOpen) return null;

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
          {onConfirm && (
            <button
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
