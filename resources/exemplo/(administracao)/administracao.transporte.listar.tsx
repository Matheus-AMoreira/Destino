import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/store/sessionStore";
import { createFileRoute } from "@tanstack/react-router";
import api from "#/lib/api";
import { FaTruckPlane } from "react-icons/fa6";
import { TbPlus } from "react-icons/tb";

interface Transporte {
  id: number;
  empresa: string;
  meio: string;
  preco: number;
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/transporte/listar",
)({
  component: TransporteLista,
});

export default function TransporteLista() {
  const navigate = useNavigate();
  const { usuario, isLoading } = useSession();
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransportes = async () => {
    if (!usuario) return;

    setLoading(true);

    try {
      const response = await api.get("/transporte");
      setTransportes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && usuario) {
      fetchTransportes();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [usuario, isLoading]);

  const handleEdit = (id: number) => {
    navigate({ to: "/administracao/transporte/registrar", search: { id: id.toString() } } as any);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este transporte?")) return;

    try {
      await api.delete(`/transporte/${id}`);
      alert("Transporte excluído com sucesso!");
      fetchTransportes();
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
            <FaTruckPlane className="text-3xl" />
            <span>Gerenciar Transportes</span>
          </h1>
          <button
            onClick={() => navigate({ to: "/administracao/transporte/registrar" })}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center space-x-2 justify-center"
          >
            <TbPlus className="text-lg" />
            <span>Novo Transporte</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : transportes.length === 0 ? (
          <p className="text-gray-500">Nenhum transporte encontrado.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo Base
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transportes.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.meio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`R$ ${item.preco.toFixed(2).replace(".", ",")}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1.5 text-sm rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
