import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/store/sessionStore";
import { FaMapMarkedAlt } from "react-icons/fa";
import { RiMapPinAddFill } from "react-icons/ri";
import { createFileRoute } from "@tanstack/react-router";
import api from "#/lib/api";

interface Oferta {
  id: number;
  preco: number;
  inicio: string;
  fim: string;
  disponibilidade: number;
  status: string;
  hotel?: { nome: string };
  transporte?: { empresa: string; meio: string };
}

interface Pacote {
  id: number;
  nome: string;
  descricao: string;
  tags: { tag: string }[];
  ofertas: Oferta[];
  status?: string;
}

interface PacotesAgrupados {
  [local: string]: Pacote[];
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/pacote/listar",
)({
  component: PacoteLista,
});

export default function PacoteLista() {
  const { usuario, isLoading } = useSession();
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<PacotesAgrupados>({});
  const [loading, setLoading] = useState(false);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});
  const [filtroTexto, setFiltroTexto] = useState("");

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  useEffect(() => {
    const fetchHoteis = async () => {
      if (!usuario || !usuario.accessToken) return;

      setLoading(true);

      try {
        const response = await api.get("/pacote/agrupado-admin", {
          headers: {
            Authorization: `Bearer ${usuario.accessToken}`,
          },
        });

        setGrupos(response.data);
        const initialOpenState: Record<string, boolean> = {};
        Object.keys(response.data).forEach((key) => (initialOpenState[key] = true));
        setAbertos(initialOpenState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && usuario) {
      fetchHoteis();
    }
  }, [usuario, isLoading]);

  const toggleGrupo = (local: string) => {
    setAbertos((prev) => ({ ...prev, [local]: !prev[local] }));
  };

  const handleEditar = (viagemId: number) => {
    navigate({ to: "/administracao/pacote/registrar", search: { id: viagemId.toString() } } as any);
  };

  const handleVisualizar = () => {
    navigate({
      to: "/buscar",
      search: {
        termo: "",
        precoMax: 0,
        page: 0,
        size: 12,
      },
    });
  };

  const handleExcluir = async (pacoteId: number) => {
    if (!confirm("Tem certeza que deseja excluir este pacote? Ele deve estar sem ofertas ativas.")) return;
    try {
      await api.delete(`/pacote/${pacoteId}`);
      alert("Pacote excluído com sucesso!");
      window.location.reload();
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.response?.data || error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EMANDAMENTO":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
            Em Andamento
          </span>
        );
      case "CONCLUIDO":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
            Concluído
          </span>
        );
      case "CANCELADO":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Título: Alinhamento do ícone e texto na mesma linha */}
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaMapMarkedAlt className="text-3xl" />
            <span>Gerenciar Pacotes de Viagem</span>
          </h1>
          {/* Botão Adicionar: Alinhamento e hover verde */}
          <button
            onClick={() => navigate({ to: "/administracao/pacote/registrar" })}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center space-x-2 justify-center"
          >
            <RiMapPinAddFill className="text-lg" />
            <span>Adicionar Pacote de Viagens</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, região, cidade, estado ou descrição..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando pacotes...</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grupos).map(([local, pacotes]) => {
              const desc = filtroTexto.toLowerCase();
              const pacotesFiltrados = pacotes.filter(p => 
                p.nome.toLowerCase().includes(desc) || 
                p.descricao.toLowerCase().includes(desc) || 
                local.toLowerCase().includes(desc)
              );

              if (pacotesFiltrados.length === 0) return null;

              return (
                <div
                  key={local}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                {/* Cabeçalho do Grupo (Local) */}
                <div
                  className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleGrupo(local)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl transform transition-transform duration-200"
                      style={{ rotate: abertos[local] ? "180deg" : "0deg" }}
                    >
                      ▼
                    </span>
                    <h2 className="text-lg font-bold text-gray-800">
                      📍 {local}
                    </h2>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {pacotesFiltrados.length} pacotes
                    </span>
                  </div>
                </div>

                {/* Lista de Pacotes (Expandível) */}
                {abertos[local] && (
                  <div className="divide-y divide-gray-100">
                    {pacotesFiltrados.map((pacote) => (
                      <div
                        key={pacote.id}
                        className="p-6 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {pacote.nome}
                            </h3>
                            {getStatusBadge(pacote.status || "")}
                          </div>

                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {pacote.descricao}
                          </p>

                          <div className="flex gap-4 text-sm text-gray-500">
                            {pacote.ofertas && pacote.ofertas.length > 0 ? (
                              <>
                                <span>🏨 {pacote.ofertas[0].hotel?.nome}</span>
                                <span>✈️ {pacote.ofertas[0].transporte?.meio}</span>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
                                  {pacote.ofertas.length} oferta(s)
                                </span>
                              </>
                            ) : (
                              <span className="text-red-500 text-xs font-semibold">Sem ofertas ativas</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center gap-2 min-w-[150px]">
                          <span className="text-lg font-bold text-blue-600">
                            {pacote.ofertas && pacote.ofertas.length > 0
                              ? `A partir de ${formatarValor(Math.min(...pacote.ofertas.map(o => o.preco)))}`
                              : "Sem Preço"}
                          </span>

                          <div className="flex gap-2 w-full mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisualizar();
                              }}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            >
                              Ver
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditar(pacote.id);
                              }}
                              className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExcluir(pacote.id);
                              }}
                              className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )})}

            {!isLoading && Object.keys(grupos).length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum pacote cadastrado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
