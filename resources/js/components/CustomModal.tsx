import React from 'react';

export interface ModalData {
    show: boolean;
    mensagem: string;
    url: string | null;
}

interface CustomModalProps {
    modalData: ModalData;
    setModal: (data: ModalData) => void;
}

export default function CustomModal({ modalData, setModal }: CustomModalProps) {
    if (!modalData.show) return null;

    const handleClose = () => {
        setModal({ ...modalData, show: false });
        if (modalData.url) {
            window.location.href = modalData.url;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
                <div className="mb-4 text-center">
                    <p className="whitespace-pre-line text-lg font-medium text-gray-800">
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
