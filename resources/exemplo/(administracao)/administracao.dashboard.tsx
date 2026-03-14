import api from "#/lib/api";
import { BarChartComponent } from "@/components/administracao/dashboard/BarChartComponent";
import { PieChartComponent } from "@/components/administracao/dashboard/PieChartComponent";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/dashboard",
)({
  component: Dashboard,
});

const COLORS_STATUS = ["#00C49F", "#FFBB28", "#FF8042"];
const COLORS_TRANSPORTE = ["#0088FE", "#8884d8", "#82ca9d"];

// Hook para dados estáticos (que não dependem de ano)
const useDashboardStaticStats = () => {
  return useQuery({
    queryKey: ["dashboard", "static-stats"],
    queryFn: async () => {
      const [resStatus, resTransporte] = await Promise.all([
        api.get("/dashboard/status-viagem"),
        api.get("/dashboard/transporte-stats"),
      ]);
      return { status: resStatus.data, transporte: resTransporte.data };
    },
  });
};

// Hook para Viagens Mensais (depende do ano)
const useViagensMensais = (year: number) => {
  return useQuery({
    queryKey: ["dashboard", "viagens-mensais", year],
    queryFn: () =>
      api.get(`/dashboard/viagens/mensais?ano=${year}`).then((res) => res.data),
    placeholderData: (prev) => prev,
  });
};

// Hook para Compras (depende do ano)
const useComprasMensais = (year: number) => {
  return useQuery({
    queryKey: ["dashboard", "compras-mensais", year],
    queryFn: () =>
      api
        .get(`/dashboard/viagens/vendidos?ano=${year}`)
        .then((res) => res.data),
    placeholderData: (prev) => prev,
  });
};

export default function Dashboard() {
  const [viagensYear, setViagensYear] = useState(new Date().getFullYear());
  const [comprasYear, setcomprasYear] = useState(new Date().getFullYear());

  // Chamadas independentes
  const staticStats = useDashboardStaticStats();
  const viagens = useViagensMensais(viagensYear);
  const compras = useComprasMensais(comprasYear);

  // Erro global ou específico (opcional)
  const hasError = staticStats.isError || viagens.isError || compras.isError;

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {hasError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          Ocorreu um erro ao carregar alguns indicadores.
        </div>
      )}

      {/* Linha 1: Dados de Pizza (Carregam juntos) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {staticStats.isLoading ? (
          <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />
        ) : (
          <>
            <PieChartComponent
              title="Status das Viagens"
              data={staticStats.data?.status}
              colors={COLORS_STATUS}
            />
            <PieChartComponent
              title="Meios de Transporte"
              data={staticStats.data?.transporte}
              colors={COLORS_TRANSPORTE}
            />
          </>
        )}
      </div>

      {/* Linha 2: Viagens (Independente) */}
      <div className={viagens.isFetching ? "opacity-60" : ""}>
        <BarChartComponent
          title={`Viagens Concluídas em ${viagensYear}`}
          data={viagens.data || []}
          xAxisKey="name"
          bars={[{ key: "value", label: "Viagens", color: "#82ca9d" }]}
          year={viagensYear}
          setYear={setViagensYear}
          isLoading={viagens.isLoading}
        />
      </div>

      {/* Linha 3: Compras (Independente) */}
      <div className={compras.isFetching ? "opacity-60" : ""}>
        <BarChartComponent
          title={`Volume de Compras em ${comprasYear}`}
          data={compras.data || []}
          xAxisKey="name"
          bars={[{ key: "value", label: "Vendas", color: "#8884d8" }]}
          year={comprasYear}
          setYear={setcomprasYear}
          isLoading={compras.isLoading}
        />
      </div>
    </div>
  );
}
