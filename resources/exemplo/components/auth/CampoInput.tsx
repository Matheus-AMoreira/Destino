type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface CampoInputProps {
  label: string;
  type: "text" | "username" | "email" | "password" | "number" | "tel";
  value: string;
  onChange: (e: InputChangeEvent) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  isError?: boolean;
  isSuccess?: boolean;
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
}: CampoInputProps) {
  let borderColorClass =
    "border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]";

  if (isSuccess) {
    borderColorClass =
      "border-green-500 focus:border-green-500 focus:shadow-[0_0_5px_rgba(0,255,0,0.3)] bg-green-50";
  } else if (isError) {
    borderColorClass =
      "border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50";
  }

  return (
    <div className="mb-5 text-left">
      <label className="block mb-2 font-bold text-[#555]">{label}</label>

      <input
        className={`
          w-full px-4 py-3 
          border rounded-lg text-base 
          transition duration-300 
          focus:outline-none
          ${borderColorClass}
        `}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
}
