export function BotaoIcf({ children, className = "", ...props }) {
  return (
    <button
      className={`text-surface-50 rounded-lg h-10 w-full ${className}`}
      {...props}>
        
      {children}
    </button>
  );
}