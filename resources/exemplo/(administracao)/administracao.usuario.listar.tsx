import { useSession } from "@/store/sessionStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "#/lib/api";
import { FaUsers } from "react-icons/fa6";
import { TbUserCheck } from "react-icons/tb";

interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cadastro: string;
}

export interface InvalidUsersResponse {
  users: Usuario[];
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/usuario/listar",
)({
  component: UsuarioLista,
});

export default function UsuarioLista() {
  const { usuario, isLoading } = useSession();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    if (!usuario) return;

    setLoading(true);
    try {
      const response = await api.get("/usuario/invalidos");
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const ValidarUsuario = async (id: number) => {
    setLoading(true);
    try {
      await api.patch(`/usuario/validar/${id}`);
      alert("Usuário validado com sucesso!");
      fetchUsuarios();
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || error.message;
      alert(`Erro ao validar: ${msg}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading && usuario) {
      fetchUsuarios();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [usuario, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaUsers className="text-3xl" />
            <span>Atualizar Usuários</span>
          </h1>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : usuarios.length === 0 ? (
           <div className="text-center py-10 text-gray-500">
             Nenhum cadastro precisando de avalição foi encontrado!
           </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valido
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cpf}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cadastro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => ValidarUsuario(item.id)}
                        className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1.5 text-sm rounded flex items-center space-x-1 float-right"
                      >
                        <TbUserCheck className="text-lg" />
                        <span>Validar</span>
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
