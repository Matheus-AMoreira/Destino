import { useState, useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { FaTruckPlane } from "react-icons/fa6";
import { TbBuildingAirport } from "react-icons/tb";
import { MdLocalShipping } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineAirplanemodeInactive } from "react-icons/md";
import { MdOutlineAirplanemodeActive } from "react-icons/md";
import api from "#/lib/api";

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/transporte/registrar",
)({
  component: RegistrarTransporte,
});

export default function RegistrarTransporte() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const id = search?.id;
  const isEditing = !!id;

  const [empresa, setEmpresa] = useState("");
  const [meio, setMeio] = useState("AEREO");
  const [preco, setPreco] = useState<number>(0);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    const editar = async () => {
      try {
        const response = await api.get(`/transporte/${id}`);
        const result = response.data;

        setEmpresa(result.empresa);
        setMeio(result.meio);
        setPreco(result.preco);
      } catch (erro) {
        console.log(erro);
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) {
      editar();
    } else {
      setLoading(false);
    }
  }, [id, isEditing]);

  const handleSalvar = async () => {
    if (!empresa) {
      alert("Informe o nome da empresa.");
      return;
    }

    const payload = {
      empresa,
      meio,
      preco: Number(preco),
    };

    try {
      const url = isEditing ? `/transporte/${id}` : "/transporte";

      if (isEditing) {
        await api.put(url, payload);
      } else {
        await api.post(url, payload);
      }

      alert(isEditing ? "Transporte atualizado!" : "Transporte criado!");
      navigate({ to: "/administracao/transporte/listar" });
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensagem || "Erro de conexão.";
      alert(msg);
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
        <FaTruckPlane className="text-2xl" />
        <span>{isEditing ? "Editar Transporte" : "Novo Transporte"}</span>
      </h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
            <TbBuildingAirport className="text-lg text-gray-600" />
            <span>Empresa</span>
          </label>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className={inputStyle}
            placeholder="Ex: Latam"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
              <MdLocalShipping className="text-lg text-gray-600" />
              <span>Meio de Transporte</span>
            </label>
            <select
              value={meio}
              onChange={(e) => setMeio(e.target.value)}
              className={inputStyle}
            >
              <option value="AEREO">Aéreo</option>
              <option value="TERRESTRE">Terrestre</option>
              <option value="MARITIMO">Marítimo</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
              <FaMoneyCheckAlt className="text-lg text-gray-600" />
              <span>Custo Base (R$)</span>
            </label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => navigate({ to: "/administracao/transporte/listar" })}
            className="px-4 py-2 rounded font-medium text-white bg-red-600 hover:bg-red-800 transition-colors flex items-center space-x-2"
          >
            <MdOutlineAirplanemodeInactive className="text-lg" />
            <span>Cancelar</span>
          </button>

          <button
            onClick={handleSalvar}
            className="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <MdOutlineAirplanemodeActive className="text-lg" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
