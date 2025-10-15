export function BotaoDiacono({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-diacono-blue-300 text-surface-50 rounded-lg h-10 font-semibold ${className} w-full flex items-center justify-center`}
      {...props}>
        
      {children}
    </button>
  );
}