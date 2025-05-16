import { XIcon } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full mx-auto shadow-lg">
        <div className="flex items-center justify-between w-full">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button onClick={onClose}>
            <XIcon size={20} />
          </button>
        </div>
        <div className="my-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
