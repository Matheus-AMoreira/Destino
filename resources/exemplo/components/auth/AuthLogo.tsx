import { Link } from "@tanstack/react-router";
import PaulaViagens from "/iconcor.png";

export default function AuthLogo() {
  return (
    <div className="hidden md:flex w-1/2 items-center justify-center">
      <div className="w-80 h-80 bg-white rounded-2xl shadow-[5px_5px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <Link to="/">
          <img
            src={PaulaViagens}
            alt="Logo Paula Vigens"
            className="object-contain max-w-full max-h-full rounded-xl p-2"
          />
        </Link>
      </div>
    </div>
  );
}
