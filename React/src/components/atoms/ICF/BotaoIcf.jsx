import { cn } from "@/lib/utils";

export function BotaoIcf({ 
  children, 
  className = "", 
  variant = "primary",
  size = "default",
  disabled = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-icf-primary-400 hover:bg-icf-primary-500 text-white",
    secondary: "bg-icf-primary-100 hover:bg-icf-primary-200 text-icf-primary-400",
    outline: "border border-icf-primary-200 bg-white hover:bg-icf-primary-50 text-icf-primary-400",
    ghost: "hover:bg-icf-primary-50 text-icf-primary-400",
    danger: "bg-danger-500 hover:bg-danger-600 text-white",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}