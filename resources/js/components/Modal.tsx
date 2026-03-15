import { router } from '@inertiajs/react';

export interface ModalData {
    show: boolean;
    mensagem: string;
    url: string | null;
}

interface CustomModalProps {
    modalData: ModalData;
    setModal: (data: ModalData) => void;
}

export default function Modal({ modalData, setModal }: CustomModalProps) {
    const handleClose = () => {
        setModal({ ...modalData, show: false });

        if (modalData.url) {
            router.visit(modalData.url);
        }
    };

    if (!modalData.show) {
        return null;
    }

    return (
        <div className="bg-opacity-50 fixed z-50 flex items-center justify-center rounded-xl border-2 border-gray-600">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
                <div className="mb-4 text-center">
                    <p className="text-lg font-medium whitespace-pre-line text-gray-800">
                        {modalData.mensagem}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
