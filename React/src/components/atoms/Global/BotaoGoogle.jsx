import { FcGoogle } from 'react-icons/fc'
export function BotaoGoogle({ children }) {
  return (
    <button className="bg-[#CEDAEA] text-diacono-blue-400 h-10 flex items-center justify-center w-full gap-2 rounded-lg font-semibold">
      <FcGoogle className="text-2xl" />
      {children}
    </button>
  );
}