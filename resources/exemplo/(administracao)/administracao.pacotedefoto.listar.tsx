import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TbPhotoShare } from "react-icons/tb";
import { HiMiniCamera } from "react-icons/hi2";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import api from "#/lib/api";

interface PacoteFoto {
  id: number;
  nome: string;
  fotoDoPacote: string;
  fotos?: any[];
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/pacotedefoto/listar",
)({
  component: PacotesFotoLista,
});

export default function PacotesFotoLista() {
  const navigate = useNavigate();

  const [pacotes, setPacotes] = useState<PacoteFoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchHoteis = async () => {
      setLoading(true);
      try {
        const response = await api.get("/pacote-foto");
        setPacotes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoteis();
  }, []);

  const handleEditar = (id: number) => {
    navigate({
      to: "/administracao/pacotedefoto/registrar",
      search: { id: id.toString() } as any,
    });
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este pacote de foto?")) return;

    setLoading(true);
    try {
      await api.delete(`/pacote-foto/${id}`);
      alert("Pacote de foto excluído com sucesso!");
      // Re-fetch 
      const response = await api.get("/pacote-foto");
      setPacotes(response.data);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.mensagem || "Erro ao excluir o pacote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HiMiniCamera className="text-3xl mr-2" />
            <span>Gerenciar Pacotes de Fotos</span>
          </h1>
          <button
            onClick={() =>
              navigate({ to: "/administracao/pacotedefoto/registrar" })
            }
            // Botão "Novo Pacote de Fotos" (MANTIDO)
            className="text-white bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 justify-center shadow-md"
          >
            <TbPhotoShare className="text-lg" />
            <span>Novo Pacote de Fotos</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacotes.map((pct) => (
              <div
                key={pct.id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <img
                  src={pct.fotoDoPacote}
                  alt={pct.nome}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{pct.nome}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {pct.fotos?.length || 0} fotos adicionais
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(pct.id)}
                      className="flex-1 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <BiSolidPencil className="text-lg" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleExcluir(pct.id)}
                      className="flex-1 py-2 rounded font-medium text-white bg-red-600 hover:bg-red-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaTrash className="text-lg" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
