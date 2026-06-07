import { router } from '@inertiajs/react';

export interface ModalData {
    show: boolean;
    mensagem: string;
    url?: string | null;
    method?: string;
    action?: () => void;
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

    const handleConfirm = () => {
        if (modalData.action) {
            modalData.action();
        }
        setModal({ ...modalData, show: false });
    };

    if (!modalData.show) {
        return null;
    }

    const isConfirmModal = !!modalData.action;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="mb-6 text-center">
                    <p className="text-lg font-medium whitespace-pre-line text-gray-800 leading-relaxed">
                        {modalData.mensagem}
                    </p>
                </div>
                {isConfirmModal ? (
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="w-full rounded-lg bg-gray-200 py-3 font-bold text-gray-700 transition hover:bg-gray-300 active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`w-full rounded-lg py-3 font-bold text-white transition active:scale-95 ${
                                modalData.method === 'DELETE'
                                    ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-200'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'
                            }`}
                        >
                            {modalData.method === 'DELETE'
                                ? 'Deletar'
                                : 'Confirmar'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleClose}
                        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 active:scale-95"
                    >
                        OK
                    </button>
                )}
            </div>
        </div>
    );
}
