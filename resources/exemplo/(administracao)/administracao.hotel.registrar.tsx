import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FaHotel } from "react-icons/fa6";
import { TbPencilPin } from "react-icons/tb";
import { MdOutlineMyLocation } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { RiTreasureMapFill } from "react-icons/ri";
import { FaSearchLocation } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { FaTreeCity } from "react-icons/fa6";
import { TbBuildingOff } from "react-icons/tb";
import { TbBuildingPlus } from "react-icons/tb";
import { createFileRoute } from "@tanstack/react-router";
import api from "#/lib/api";

interface Regiao {
  id: number;
  nome: string;
  sigla: string;
}

interface Estado {
  id: number;
  nome: string;
  sigla: string;
  regiao: Regiao;
}

interface Cidade {
  id: number;
  nome: string;
  estado: Estado;
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/hotel/registrar",
)({
  component: RegistrarHotel,
});

export default function RegistrarHotel() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const id = search?.id;

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [diaria, setDiaria] = useState<number>(0);

  const [selectedRegiao, setSelectedRegiao] = useState<number | "">("");
  const [selectedEstado, setSelectedEstado] = useState<number | "">("");
  const [selectedCidade, setSelectedCidade] = useState<number | "">("");

  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hotel/regioes")
      .then((res) => {
        setRegioes(res.data);
        if (!id) setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (selectedRegiao) {
      api
        .get(`/hotel/estados/${selectedRegiao}`)
        .then((res) => setEstados(res.data))
        .catch(console.error);
    } else {
      setEstados([]);
      setCidades([]);
    }
  }, [selectedRegiao]);

  useEffect(() => {
    if (selectedEstado) {
      api
        .get(`/hotel/cidades/${selectedEstado}`)
        .then((res) => setCidades(res.data))
        .catch(console.error);
    } else {
      setCidades([]);
    }
  }, [selectedEstado]);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const res = await api.get(`/hotel/${id}`);
          const hotel = res.data;
          setNome(hotel.nome);
          setEndereco(hotel.endereco);
          setDiaria(hotel.diaria);

          if (hotel.cidade) {
            const cidadeId = hotel.cidade.id;
            const estadoId = hotel.cidade.estado.id;
            const regiaoId = hotel.cidade.estado.regiao.id;

            setSelectedRegiao(regiaoId);

            const resEstados = await api.get(`/hotel/estados/${regiaoId}`);
            setEstados(resEstados.data);
            setSelectedEstado(estadoId);

            const resCidades = await api.get(`/hotel/cidades/${estadoId}`);
            setCidades(resCidades.data);
            setSelectedCidade(cidadeId);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id, id]);

  const handleSalvar = async () => {
    if (!nome || !endereco || !selectedCidade) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      nome,
      endereco,
      diaria: Number(diaria),
      cidade: Number(selectedCidade),
    };

    try {
      const url = id ? `/hotel/${id}` : "/hotel";

      if (id) {
        await api.put(url, payload);
      } else {
        await api.post(url, payload);
      }

      alert(id ? "Hotel atualizado!" : "Hotel criado!");
      navigate({ to: "/administracao/hotel/listar" });
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensagem || "Erro de conexão.";
      alert(msg);
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  // Estilo unificado para inputs (suave e moderno)
  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800";
  const selectStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 text-gray-800";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3 text-gray-900">
        <FaHotel className="text-2xl" />
        <span>{id ? "Editar Hotel" : "Novo Hotel"}</span>
      </h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
            <TbPencilPin className="text-lg" />
            <span>Nome do Hotel</span>
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputStyle}
            placeholder="Ex: Hotel Copacabana Palace"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
            <MdOutlineMyLocation className="text-lg" />
            <span>Endereço</span>
          </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className={inputStyle}
            placeholder="Av. Atlântica, 1702"
          />
        </div>

        <div className="pb-2">
          <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
            <FaMoneyCheckAlt className="text-lg" />
            <span>Diária (R$)</span>
          </label>
          <input
            type="number"
            value={diaria}
            onChange={(e) => setDiaria(Number(e.target.value))}
            className={inputStyle}
          />
        </div>

        <div className="border-t border-gray-200 my-6"></div>
        <div className="pt-4 mt-4">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900">
            <RiTreasureMapFill className="text-xl" />
            <span>LOCALIZAÇÃO</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
                <FaSearchLocation className="text-lg" />
                <span>Região</span>
              </label>
              <select
                value={selectedRegiao}
                onChange={(e) => {
                  setSelectedRegiao(Number(e.target.value));
                  setSelectedEstado("");
                  setSelectedCidade("");
                }}
                className={selectStyle}
              >
                <option value="">Selecione a Região...</option>
                {regioes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
                <FaFlag className="text-lg" />
                <span>Estado</span>
              </label>
              <select
                value={selectedEstado}
                onChange={(e) => {
                  setSelectedEstado(Number(e.target.value));
                  setSelectedCidade("");
                }}
                className={selectStyle}
                disabled={!selectedRegiao}
              >
                <option value="">Selecione o Estado...</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome} ({e.sigla})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center space-x-2 text-gray-700">
                <FaTreeCity className="text-lg" />
                <span>Cidade</span>
              </label>
              <select
                value={selectedCidade}
                onChange={(e) => setSelectedCidade(Number(e.target.value))}
                className={selectStyle}
                disabled={!selectedEstado}
              >
                <option value="">Selecione a Cidade...</option>
                {cidades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => navigate({ to: "/administracao/hotel/listar" })}
            className="px-4 py-2 rounded font-medium text-white bg-red-600 hover:bg-red-800 transition-colors flex items-center space-x-2"
          >
            <TbBuildingOff className="text-lg" />
            <span>Cancelar</span>
          </button>

          <button
            onClick={handleSalvar}
            className="px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <TbBuildingPlus className="text-lg" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
