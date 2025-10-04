export function BotaoPadrao({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-diacono-blue-300 text-surface-50 rounded-lg h-12 font-semibold ${className} w-full`}
      {...props}>
        
      {children}
    </button>
  );
}