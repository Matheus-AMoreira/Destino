import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Camera, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

interface PacoteFotoData {
    id: number;
    nome: string;
    foto_do_pacote: string | null;
}

interface Props {
    pacoteFotos: PacoteFotoData[];
    success?: string;
}

export default function Index({ pacoteFotos = [], success }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Deseja realmente excluir este álbum?')) {
            router.delete(`/administracao/pacotedefoto/${id}`);
        }
    };

    return (
        <AdminLayout title="Álbuns de Fotos">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600 p-2 rounded-lg text-white">
                        <Camera size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Álbuns de Fotos</h1>
                </div>
                
                <Link
                    href="/administracao/pacotedefoto/registrar"
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
                >
                    <Plus size={20} />
                    <span>Novo Álbum</span>
                </Link>
            </div>

            {success && (
                <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pacoteFotos.length > 0 ? (
                    pacoteFotos.map((album) => (
                        <div key={album.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                {album.foto_do_pacote ? (
                                    <img 
                                        src={album.foto_do_pacote} 
                                        alt={album.nome}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="mb-3 font-bold text-gray-900 truncate">{album.nome}</h3>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                    <Link
                                        href={`/administracao/pacotedefoto/editar/${album.id}`}
                                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        <Pencil size={14} />
                                        <span>Editar</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(album.id)}
                                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={14} />
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        Nenhum álbum cadastrado.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
