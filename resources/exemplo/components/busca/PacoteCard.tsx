import type { Pacote } from "#/utils/type/Pacote";
import { useNavigate } from "@tanstack/react-router";

import placeholder from "/placeholder.jpg";

import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

type PacoteCard = {
  pacote: Pacote;
};

export default function PacoteCard({ pacote }: PacoteCard) {
  const navigate = useNavigate();

  const handleVisualizar = () => {
    navigate({ to: "/pacote/$nome", params: { nome: pacote.nome } });
  };

  const destino =
    pacote.ofertas[0].hotel?.cidade?.nome || "Destino Desconhecido";
  const fotoUrl = pacote.fotosDoPacote?.fotoDoPacote || placeholder;

  return (
    <div
      key={pacote.id}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={fotoUrl}
          alt={pacote.nome}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        {pacote.status === "CONCLUIDO" && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-80">
            Encerrado
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {pacote.nome}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          <MdOutlineMyLocation className="text-xl" />
          {destino}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {pacote.descricao}
        </p>
        <div className="block justify-between items-end pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase">
              <FaMoneyCheckAlt className="text-xl" />A partir de
            </p>
            <p className="text-xl font-bold text-blue-600">
              {formatarValor(pacote.ofertas[0].preco)}
            </p>
          </div>
          <button
            onClick={() => handleVisualizar()}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
