import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "ativos", label: "Ativos" },
  { value: "inativos", label: "Inativos" },
];

export function StatusToggle({ value, onChange, options = statusOptions }) {
  return (
    <div className="flex items-center">
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium border transition-colors",
            index === 0 && "rounded-l-lg",
            index === options.length - 1 && "rounded-r-lg",
            index !== 0 && "-ml-px",
            value === option.value
              ? "bg-icf-primary-400 text-white border-icf-primary-400 z-10"
              : "bg-white text-icf-primary-400 border-icf-primary-200 hover:bg-icf-primary-50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
