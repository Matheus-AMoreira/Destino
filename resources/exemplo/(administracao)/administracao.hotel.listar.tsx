import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/store/sessionStore";
import { createFileRoute } from "@tanstack/react-router";
import api from "#/lib/api";
import { FaHotel } from "react-icons/fa6";
import { TbBuildingPlus } from "react-icons/tb";

interface cidade {
  id: number;
  nome: String;
  endereco: String;
  diaria: number;
  estado: {
    id: number;
    nome: String;
    sigla: String;
    regiao: {
      id: number;
      nome: String;
      sigla: String;
    };
  };
}

interface Hotel {
  id: number;
  nome: string;
  diaria: number;
  cidade: cidade;
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/hotel/listar",
)({
  component: HotelLista,
});

export default function HotelLista() {
  const navigate = useNavigate();
  const { usuario, isLoading } = useSession();
  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && usuario) {
      fetchHoteis();
    }
  }, [usuario, isLoading]);

  const fetchHoteis = async () => {
    if (!usuario) return;

    setLoading(true);

    try {
      const response = await api.get("/hotel");
      setHoteis(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate({
      to: "/administracao/hotel/registrar",
      search: { id: id.toString() } as any,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este hotel?")) return;

    try {
      await api.delete(`/hotel/${id}`);
      alert("Hotel excluído com sucesso!");
      fetchHoteis();
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || error.message;
      alert(`Erro: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaHotel className="text-3xl" />
            <span>Gerenciar Hotéis</span>
          </h1>
          <button
            onClick={() => navigate({ to: "/administracao/hotel/registrar" })}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center space-x-2 justify-center"
          >
            <TbBuildingPlus className="text-lg" />
            <span>Novo Hotel</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : hoteis.length === 0 ? (
          <p className="text-gray-500">Nenhum hotel encontrado.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diária
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hoteis.map((hotel) => (
                  <tr key={hotel.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hotel.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {hotel.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hotel.cidade
                        ? `${hotel.cidade.nome}/${hotel.cidade.estado.sigla}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`R$ ${hotel.diaria.toFixed(2).replace(".", ",")}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(hotel.id)}
                        className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1.5 text-sm rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="text-white bg-red-600 hover:bg-red-800 px-3 py-1.5 text-sm rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
