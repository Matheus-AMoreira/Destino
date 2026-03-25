interface Props {
    senha: string;
}

export default function RequisitosSenha({ senha }: Props) {
    const requisitos = [
        { label: 'Mínimo de 8 caracteres', valido: senha.length >= 8 },
        { label: 'Uma letra maiúscula', valido: /[A-Z]/.test(senha) },
        { label: 'Uma letra minúscula', valido: /[a-z]/.test(senha) },
        { label: 'Um número', valido: /\d/.test(senha) },
        {
            label: 'Um caractere especial',
            valido: /[@$!%*?&#\-_]/.test(senha),
        },
    ];

    if (senha.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left">
            <p className="mb-2 text-xs font-semibold text-gray-500">
                Requisitos da senha:
            </p>
            <ul className="space-y-1 text-xs">
                {requisitos.map((req, idx) => (
                    <li
                        key={idx}
                        className={`flex items-center gap-2 ${req.valido ? 'font-medium text-green-600' : 'text-gray-400'}`}
                    >
                        <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${req.valido ? 'bg-green-100' : 'bg-gray-200'}`}
                        >
                            {req.valido ? '✓' : '•'}
                        </span>
                        {req.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
