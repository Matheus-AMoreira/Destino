import React from 'react';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface CampoInputProps {
    label: string;
    type: 'text' | 'username' | 'email' | 'password' | 'number' | 'tel';
    value: string;
    onChange: (e: InputChangeEvent) => void;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    isError?: boolean;
    isSuccess?: boolean;
    name?: string;
}

export default function CampoInput({
    label,
    type,
    value,
    onChange,
    required = false,
    minLength,
    maxLength,
    placeholder,
    isError = false,
    isSuccess = false,
    name,
}: CampoInputProps) {
    let borderColorClass =
        'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]';

    if (isSuccess) {
        borderColorClass =
            'border-green-500 focus:border-green-500 focus:shadow-[0_0_5px_rgba(0,255,0,0.3)] bg-green-50';
    } else if (isError) {
        borderColorClass =
            'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50';
    }

    return (
        <div className="mb-5 text-left">
            <label className="mb-2 block font-bold text-[#555]">{label}</label>

            <input
                className={`w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none ${borderColorClass}`}
                type={type === 'username' ? 'text' : type}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                placeholder={placeholder}
                name={name}
            />
        </div>
    );
}
