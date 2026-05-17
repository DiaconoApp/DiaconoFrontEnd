import { FcGoogle } from 'react-icons/fc'

export function BotaoGoogle({ children, disabled = false, type = 'button', ...props }) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`h-10 flex items-center justify-center w-full gap-2 rounded-lg font-semibold transition-all ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          : 'bg-[#CEDAEA] text-diacono-blue-400 hover:bg-[#B8C1C7] active:scale-95'
      }`}
    >
      <FcGoogle className="text-2xl" />
      {children}
    </button>
  );
}