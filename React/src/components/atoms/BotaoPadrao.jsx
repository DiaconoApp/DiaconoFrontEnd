export function BotaoPadrao({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-diacono-blue-300 text-surface-50 rounded-lg w-full h-12 font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}