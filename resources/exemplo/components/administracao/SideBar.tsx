import { useState } from "react";
import logo from "/iconcor.png";
import { BiSolidPieChartAlt2 } from "react-icons/bi";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { HiMiniCamera } from "react-icons/hi2";
import { FaHotel } from "react-icons/fa6";
import { FaTruckPlane } from "react-icons/fa6";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ROUTES } from "#/utils/paths";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminOpen, setIsAdminOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string, isSubItem = false) => `
    w-full text-left px-4 py-2 rounded-lg font-medium transition-colors mb-1
    ${isSubItem ? "text-sm pl-8" : ""}
    ${
      isActive(path)
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "text-gray-700 hover:bg-gray-100"
    }
  `;

  return (
    <div className="w-64 bg-white shadow-lg shrink-0 flex flex-col h-full sticky top-0" style={{ maxHeight: "calc(100vh - 80px)" }}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-center md:w-2.1">
          <img
            src={logo}
            alt="Equipe de atendimento"
            onClick={() => navigate({ to: "/" })}
            className="max-w-37.5 rounded-xl shadow-lg object-contain p-2 cursor-pointer"
          />
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <button
            onClick={() => navigate({ to: "/administracao/dashboard" })}
            className={linkClass("/dashboard")}
          >
            <div className="pl-4 flex items-center">
              <BiSolidPieChartAlt2 className="text-lgg mr-2 pb-0.5" />
              Dashboard
            </div>
          </button>

          <div>
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="w-full text-left px-4 py-2 rounded-lg font-bold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
            >
              <span>OPÇÕES</span>
              <span
                className={`transform transition-transform ${
                  isAdminOpen ? "rotate-180" : ""
                }`}
              >
                <IoIosArrowDropupCircle className="text-lgg mr-2 pb-0.5" />
              </span>
            </button>

            {isAdminOpen && (
              <div className="mt-1 space-y-1">
                <button
                  onClick={() =>
                    navigate({ to: "/administracao/pacote/listar" })
                  }
                  className={linkClass("/pacote/listar", true)}
                >
                  <div className="flex items-center">
                    <FaMapMarkedAlt className="text-lg mr-2 pb-0.5" />
                    Pacotes de Viagem
                  </div>
                </button>
                <button
                  onClick={() =>
                    navigate({ to: "/administracao/pacotedefoto/listar" })
                  }
                  className={linkClass(ROUTES.PACOTES_FOTO_LISTA, true)}
                >
                  <div className="flex items-center">
                    <HiMiniCamera className="text-lg mr-2 pb-0.5" />
                    Pacotes de Fotos
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate({ to: "/administracao/hotel/listar" })
                  }
                  className={linkClass(ROUTES.HOTEIS_LISTA, true)}
                >
                  <div className="flex items-center">
                    <FaHotel className="text-lg mr-2 pb-0.5" />
                    Hotéis
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate({ to: "/administracao/transporte/listar" })
                  }
                  className={linkClass(ROUTES.TRANSPORTES_LISTA, true)}
                >
                  <div className="flex items-center">
                    <FaTruckPlane className="text-lg mr-2 pb-0.5" />
                    Transporte
                  </div>
                </button>
                <button
                  onClick={() =>
                    navigate({ to: "/administracao/usuario/listar" })
                  }
                  className={linkClass(ROUTES.LISTAR_USUARIOS, true)}
                >
                  <div className="flex items-center">
                    <FaUserCog className="text-lg mr-2 pb-0.5" />
                    Usuários
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t text-xs text-gray-400 text-center">
        Versão 1.0.0
      </div>
    </div>
  );
}
