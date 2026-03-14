import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/store/sessionStore";
import { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { FaMapMarkedAlt, FaTrashAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { TbPencilPin, TbCalendarUp, TbCalendarRepeat } from "react-icons/tb";
import { FaHotel, FaTruckPlane, FaTags } from "react-icons/fa6";
import { MdDiversity3, MdDescription } from "react-icons/md";
import { HiMiniCamera } from "react-icons/hi2";
import { LuPackageX, LuPackagePlus, LuSave } from "react-icons/lu";
import api from "#/lib/api";

interface Hotel {
  id: number;
  nome: string;
  diaria: number;
}

interface Transporte {
  id: number;
  empresa: string;
  meio: string;
  preco: number;
}

interface PacoteFoto {
  id: number;
  nome: string;
  url: string;
}

interface Oferta {
  id: number;
  preco: number;
  inicio: string;
  fim: string;
  disponibilidade: number;
  status: string;
  hotel?: Hotel;
  transporte?: Transporte;
}

interface PacoteDetalhes {
  id: number;
  nome: string;
  descricao: string;
  tags: { id: number; nome: string }[];
  ofertas: Oferta[];
  fotosDoPacote?: PacoteFoto;
}

export const Route = createFileRoute(
  "/(app)/_app/(administracao)/administracao/pacote/registrar"
)({
  component: RegistrarPacote,
});

export default function RegistrarPacote() {
  const { usuario } = useSession();
  const search: any = useSearch({ strict: false });
  const id = search?.id;

  const [abaAtual, setAbaAtual] = useState<"Geral" | "Ofertas">("Geral");
  const [listaHoteis, setListaHoteis] = useState<Hotel[]>([]);
  const [listaTransportes, setListaTransportes] = useState<Transporte[]>([]);
  const [listaFotos, setListaFotos] = useState<PacoteFoto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [ofertasOriginais, setOfertasOriginais] = useState<Oferta[]>([]);

  // Pacote State
  const [formPacote, setFormPacote] = useState({
    nome: "",
    descricao: "",
    tags: "",
    pacoteFotoId: "",
  });

  // Oferta State (Create/Edit)
  const [formOferta, setFormOferta] = useState({
    id: "",
    preco: 0,
    inicio: "",
    fim: "",
    disponibilidade: 10,
    hotelId: "",
    transporteId: "",
  });
  
  const limparFormOferta = () => {
    setFormOferta({
      id: "",
      preco: 0,
      inicio: "",
      fim: "",
      disponibilidade: 10,
      hotelId: "",
      transporteId: "",
    });
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setCarregando(true);
      try {
        await buscarListasAuxiliares();
        if (id) {
          setModoEdicao(true);
          await buscarDadosDoPacoteParaEdicao(id);
        }
      } catch (erro) {
        console.error("Erro ao inicializar página:", erro);
      } finally {
        setCarregando(false);
      }
    };
    carregarDadosIniciais();
  }, [id]);

  const buscarListasAuxiliares = async () => {
    try {
      const [resHoteis, resTransportes, resFotos] = await Promise.all([
        api.get("/hotel"),
        api.get("/transporte"),
        api.get("/pacote-foto"),
      ]);
      setListaHoteis(resHoteis.data);
      setListaTransportes(resTransportes.data);
      setListaFotos(resFotos.data);
    } catch (error) {
      console.error("Erro ao buscar listas", error);
    }
  };

  const buscarDadosDoPacoteParaEdicao = async (pacoteId: string) => {
    try {
      const response = await api.get(`/publico/pacote/${pacoteId}`);
      const dados: PacoteDetalhes = response.data;
      setFormPacote({
        nome: dados.nome,
        descricao: dados.descricao,
        tags: dados.tags ? dados.tags.map((t) => t.nome).join(", ") : "",
        pacoteFotoId: dados.fotosDoPacote?.id.toString() || "",
      });
      setOfertasOriginais(dados.ofertas || []);
    } catch (error) {
      console.error("Erro ao carregar pacote", error);
    }
  };

  const atualizarApenasOfertas = async (pacoteId: string) => {
    try {
      const response = await api.get(`/publico/pacote/${pacoteId}`);
      const dados: PacoteDetalhes = response.data;
      setOfertasOriginais(dados.ofertas || []);
    } catch (error) {
      console.error("Erro ao atualizar ofertas", error);
    }
  };

  const aoSalvarPacote = async () => {
    if (!formPacote.nome.trim()) {
      alert("Por favor, preencha o Nome do pacote.");
      return;
    }
    const payload = {
      nome: formPacote.nome,
      descricao: formPacote.descricao,
      tags: formPacote.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      pacoteFoto: Number(formPacote.pacoteFotoId),
      funcionario: usuario?.id,
    };
    try {
      if (modoEdicao) {
        await api.put(`/pacote/${id}`, payload);
        alert("Pacote atualizado com sucesso!");
        // Refresh
        buscarDadosDoPacoteParaEdicao(id);
      } else {
        await api.post("/pacote", payload);
        alert("Pacote cadastrado com sucesso! Você pode adicionar as ofertas de viagem na tabela de pacotes, clicando em Editar.");
        window.history.back();
      }
    } catch (error: any) {
      alert(`Erro ao salvar pacote: ${error.response?.data || error.message}`);
    }
  };

  const aoSalvarOferta = async () => {
    if (!formOferta.hotelId || !formOferta.transporteId || !formOferta.inicio || !formOferta.fim) {
      alert("Preencha datas, hotel e transporte para a oferta.");
      return;
    }
    const payload = {
      pacoteId: Number(id),
      preco: formOferta.preco,
      inicio: formOferta.inicio,
      fim: formOferta.fim,
      disponibilidade: formOferta.disponibilidade,
      hotelId: Number(formOferta.hotelId),
      transporteId: Number(formOferta.transporteId),
    };
    try {
      if (formOferta.id) {
        await api.put(`/pacote/oferta/${formOferta.id}`, payload);
        alert("Oferta atualizada com sucesso!");
      } else {
        await api.post("/pacote/oferta/registrar", payload);
        alert("Oferta adicionada com sucesso!");
      }
      limparFormOferta();
      atualizarApenasOfertas(id);
    } catch (error: any) {
      alert(`Erro ao salvar oferta: ${error.response?.data || error.message}`);
    }
  };

  const deletarOferta = async (ofertaId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta oferta?")) return;
    try {
      await api.delete(`/pacote/oferta/${ofertaId}`);
      alert("Oferta excluida!");
      atualizarApenasOfertas(id);
    } catch (error: any) {
      alert(`Erro: ${error.response?.data || error.message}`);
    }
  };

  const editarOferta = (oferta: Oferta) => {
    setFormOferta({
      id: oferta.id.toString(),
      preco: oferta.preco,
      inicio: oferta.inicio,
      fim: oferta.fim,
      disponibilidade: oferta.disponibilidade,
      hotelId: oferta.hotel?.id.toString() || "",
      transporteId: oferta.transporte?.id.toString() || "",
    });
  };

  if (carregando) return <div className="flex justify-center items-center min-h-screen">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Cabecalho e Abas */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center space-x-2 text-gray-800">
              <FaMapMarkedAlt className="text-blue-500"/>
              <span>{modoEdicao ? `Editar Pacote: ${formPacote.nome}` : "Novo Pacote"}</span>
            </h1>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              Voltar à Lista
            </button>
          </div>
          <div className="flex border-b">
            <button
              onClick={() => setAbaAtual("Geral")}
              className={`flex-1 py-4 font-semibold text-center ${abaAtual === "Geral" ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Informações Gerais
            </button>
            <button
              onClick={() => setAbaAtual("Ofertas")}
              disabled={!modoEdicao}
              className={`flex-1 py-4 font-semibold text-center ${abaAtual === "Ofertas" ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"} ${!modoEdicao && "opacity-50 cursor-not-allowed"}`}
            >
              Ofertas de Viagem
            </button>
          </div>
        </div>

        {/* Conteudo Aba */}
        <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200 p-6">
          
          {/* ---- ABA GERAL ---- */}
          {abaAtual === "Geral" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <TbPencilPin className="text-lg" />
                  <span>Nome do Pacote</span>
                </label>
                <input
                  type="text"
                  value={formPacote.nome}
                  onChange={(e) => setFormPacote({ ...formPacote, nome: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Aventura no Acre"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <HiMiniCamera className="text-lg" />
                    <span>Fotos Promocionais</span>
                  </label>
                  <select
                    value={formPacote.pacoteFotoId}
                    onChange={(e) => setFormPacote({ ...formPacote, pacoteFotoId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="">Nenhuma</option>
                    {listaFotos.map((f) => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <FaTags className="text-lg" />
                    <span>Tags (vírgula)</span>
                  </label>
                  <input
                    type="text"
                    value={formPacote.tags}
                    onChange={(e) => setFormPacote({ ...formPacote, tags: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ex: praia, verao, romantico"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <MdDescription className="text-lg" />
                  <span>Descrição Detalhada</span>
                </label>
                <textarea
                  rows={4}
                  value={formPacote.descricao}
                  onChange={(e) => setFormPacote({ ...formPacote, descricao: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={aoSalvarPacote}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2"
                >
                  <LuSave />
                  <span>{modoEdicao ? "Salvar Alterações do Pacote" : "Criar Pacote Inicial"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ---- ABA OFERTAS ---- */}
          {abaAtual === "Ofertas" && (
            <div className="space-y-8">
              
              {/* Formulario de Nova/Edicao Oferta */}
              <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{formOferta.id ? "Editar Oferta" : "Adicionar Nova Oferta"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-600 mb-1"><TbCalendarUp className="inline mr-1"/>Ida</label>
                    <input type="date" value={formOferta.inicio} onChange={(e) => setFormOferta({...formOferta, inicio: e.target.value})} className="w-full p-2 border rounded"/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-600 mb-1"><TbCalendarRepeat className="inline mr-1"/>Volta</label>
                    <input type="date" value={formOferta.fim} onChange={(e) => setFormOferta({...formOferta, fim: e.target.value})} className="w-full p-2 border rounded"/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-600 mb-1"><FaMoneyCheckAlt className="inline mr-1"/>Preço Total (R$)</label>
                    <input type="number" step="0.01" value={formOferta.preco} onChange={(e) => setFormOferta({...formOferta, preco: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded"/>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm text-gray-600 mb-1"><MdDiversity3 className="inline mr-1"/>Vagas</label>
                    <input type="number" value={formOferta.disponibilidade} onChange={(e) => setFormOferta({...formOferta, disponibilidade: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1"><FaHotel className="inline mr-1"/>Hotel Associado</label>
                    <select value={formOferta.hotelId} onChange={(e) => setFormOferta({...formOferta, hotelId: e.target.value})} className="w-full p-2 border rounded">
                      <option value="">Selecione um Hotel...</option>
                      {listaHoteis.map((h) => <option key={h.id} value={h.id}>{h.nome} (Diária: R$ {h.diaria})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1"><FaTruckPlane className="inline mr-1"/>Transporte Associado</label>
                    <select value={formOferta.transporteId} onChange={(e) => setFormOferta({...formOferta, transporteId: e.target.value})} className="w-full p-2 border rounded">
                      <option value="">Selecione um Transporte...</option>
                      {listaTransportes.map((t) => <option key={t.id} value={t.id}>{t.empresa} - {t.meio}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  {formOferta.id && (
                    <button onClick={limparFormOferta} className="px-4 py-2 text-gray-600 bg-white border rounded hover:bg-gray-50">Cancelar Edição</button>
                  )}
                  <button onClick={aoSalvarOferta} className="px-4 py-2 bg-green-600 text-white font-semibold rounded shadow-sm hover:bg-green-700">
                    <LuSave className="inline mr-1" /> {formOferta.id ? "Salvar Oferta" : "Adicionar Oferta"}
                  </button>
                </div>
              </div>

              {/* Tabela de Ofertas Atuais */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Ofertas Cadastradas</h3>
<div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                      <thead className="text-xs text-gray-700 bg-gray-100 uppercase border-b">
                        <tr>
                          <th className="px-4 py-3">Datas</th>
                          <th className="px-4 py-3">Valores & Vagas</th>
                          <th className="px-4 py-3">Inclusões</th>
                          <th className="px-4 py-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ofertasOriginais.map((o) => (
                          <tr key={o.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className="block font-semibold">{o.inicio}</span>
                              <span className="text-gray-500 text-xs">até {o.fim}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block text-green-700 font-bold">R$ {o.preco.toFixed(2)}</span>
                              <span className="text-gray-500 text-xs">{o.disponibilidade} vagas</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block text-xs max-w-xs truncate" title={o.hotel?.nome}><FaHotel className="inline mr-1 opacity-60"/>{o.hotel?.nome}</span>
                              <span className="block text-xs mt-1 max-w-xs truncate" title={o.transporte?.empresa}><FaTruckPlane className="inline mr-1 opacity-60"/>{o.transporte?.empresa}</span>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button onClick={() => editarOferta(o)} className="text-blue-600 hover:text-blue-800 p-1 border rounded bg-white hover:bg-blue-50 transition" title="Editar">
                                <TbPencilPin className="text-base" />
                              </button>
                              <button onClick={() => deletarOferta(o.id)} className="text-red-500 hover:text-red-700 p-1 border rounded bg-white hover:bg-red-50 transition" title="Remover">
                                <FaTrashAlt className="text-sm" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
