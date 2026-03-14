import { useNavigate } from "@tanstack/react-router";

export interface Modal {
  show: boolean;
  mensagem: string;
  url: string | null;
}

interface AuthModalProps {
  modalData: Modal;
  setModal: React.Dispatch<React.SetStateAction<Modal>>;
}

export default function CustomModal({ modalData, setModal }: AuthModalProps) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (modalData.url) {
      navigate({ to: modalData.url });
    }
    setModal({ show: false, mensagem: "", url: null });
  };

  if (!modalData.show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full transform transition-all duration-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {modalData.mensagem}
        </h3>
        <button
          className="mt-4 px-6 py-2 bg-[#2071b3] hover:bg-[#1a5b8e] text-white rounded-lg font-medium"
          onClick={handleConfirm}
        >
          OK
        </button>
      </div>
    </div>
  );
}
