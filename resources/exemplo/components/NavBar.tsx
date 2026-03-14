import { useSession } from "@/store/sessionStore";
import logo from "/logo.png";
import { LuPackageSearch } from "react-icons/lu";
import { MdContactMail } from "react-icons/md";
import { TbMapPinCog } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { BiSolidLogInCircle } from "react-icons/bi";
import { BiSolidLogOutCircle } from "react-icons/bi";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const session = useSession();

  return (
    <header className="flex items-center justify-between py-1 px-8 bg-[#ff944d] pt-3 pb-1">
      <Link to="/" className="font-bold text-white pl-0">
        <div className="flex flex-col items-start">
          <img src={logo} alt="Logo" className="w-25 select-none" />
        </div>
      </Link>
      <nav className="flex gap-6 pr-0 pl-0 text-lg">
        <Link
          to="/buscar"
          search={{
            termo: "",
            precoMax: 0,
            page: 0,
            size: 12,
          }}
          className="text-white font-bold hover:text-[#2071b3] flex items-center space-x-2"
        >
          <LuPackageSearch className="text-xl" />
          <span>Buscar Pacotes</span>
        </Link>
        <Link
          to="/contato"
          className="text-white font-bold hover:text-[#2071b3] flex items-center space-x-2"
        >
          <MdContactMail className="text-xl" />
          <span>Contato</span>
        </Link>
        {session.usuario?.perfil == "ADMINISTRADOR" && (
          <Link
            to="/administracao/dashboard"
            className="text-white font-bold hover:text-[#2071b3] flex items-center space-x-2"
          >
            <TbMapPinCog className="text-xl" />
            <span>Administração</span>
          </Link>
        )}
        {session.isLoged ? (
          <span className="text-white font-bold flex items-center space-x-2">
            <Link
              to="/$usuario/viagem/listar"
              params={{ usuario: session.usuario?.nomeCompleto || "usuario" }}
              className="hover:text-[#2071b3] flex items-center space-x-2"
            >
              <FaUser className="text-xl" />
              Usuário: {session.usuario?.nomeCompleto}
            </Link>
            <p className="ml-2">|</p>
            <button
              className="text-white hover:text-[#2071b3] hover:underline hover:cursor-pointer ml-2 flex items-center space-x-1"
              onClick={() => {
                useSession.getState().logout();
              }}
            >
              <BiSolidLogOutCircle className="text-xl" />
              <span>Logout</span>
            </button>
          </span>
        ) : (
          <Link
            to="/entrar"
            className="text-white font-bold hover:text-[#2071b3] flex items-center space-x-2"
          >
            <BiSolidLogInCircle className="text-xl" />
            <span>Conecte-se</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
