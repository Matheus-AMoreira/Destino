import {
  useNavigate,
  createFileRoute,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ViagemDetalhadaDTO } from "#/utils/type/Compra";
import { useSession } from "@/store/sessionStore";
import api from "#/lib/api";

export const Route = createFileRoute(
  "/(app)/_app/(checkout)/checkout_/confirmacao/$compraId",
)({
  component: Confirmacao,
});

export default function Confirmacao() {
  const navigate = useNavigate();
  const compraId = useParams({
    from: "/(app)/_app/(checkout)/checkout_/confirmacao/$compraId",
    select: (params) => params.compraId,
  });

  console.log(compraId);
  const [compra, setCompra] = useState<ViagemDetalhadaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await api.get(`/compra/${compraId}`);
        setCompra(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da compra:", err);
        setError("Não foi possível carregar os detalhes da compra.");
      } finally {
        setLoading(false);
      }
    };

    if (compraId) {
      fetchCompra();
    } else {
      navigate({ to: "/" });
    }
  }, [compraId]);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Carregando detalhes...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Erro ao carregar detalhes
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "Compra não encontrada."}
        </p>
        <button
          onClick={() =>
            navigate({
              to: "/$usuario/viagem/listar",
              params: {
                usuario:
                  useSession.getState().usuario?.nomeCompleto || "usuario",
              },
            })
          }
          className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Minhas Viagens
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Confirmado!
          </h1>

          <p className="text-gray-600 mb-6">
            Sua viagem foi reservada com sucesso. Em breve você receberá um
            email com todos os detalhes.
          </p>

          {compra.statusCompra === "AGUARDANDO_PAGAMENTO" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-700 text-sm">
                ℹ️ Pagamento em processamento ou aguardando PIX.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Número do Pedido:</span>
                <span className="font-semibold">{compra.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pacote:</span>
                <span className="font-semibold text-right">
                  {compra.nomePacote}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-semibold text-green-600">
                  {formatarValor(Number(compra.valor))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold">{compra.statusCompra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data da Compra:</span>
                <span className="font-semibold">{compra.dataCompra}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              navigate({
                to: "/$usuario/viagem/listar/$id",
                params: {
                  usuario:
                    useSession.getState().usuario?.nomeCompleto || "usuario",
                  id: String(compra.id),
                },
              })
            }
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver Minhas Viagens Agora
          </button>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="text-gray-600 hover:text-gray-900 text-sm flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimir
            </button>

            <button
              onClick={() => navigate({ to: "/contato" })}
              className="text-gray-600 hover:text-gray-900 text-sm flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ajuda
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Obrigado por escolher a Destino! 🌴
          </p>
        </div>
      </div>
    </div>
  );
}
