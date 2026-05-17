export function SelectIcf({ 
    onChange, 
    className = "", 
    options = [], 
    value, 
    label, 
    placeholder = "Selecione...",
    disabled = false,
}) {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label className="text-sm font-medium text-icf-primary-400">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                disabled={disabled}
                className="w-full text-sm text-icf-primary-400 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 focus:outline-none focus:border-icf-primary-300 transition-colors disabled:bg-icf-primary-50 disabled:text-icf-primary-300 disabled:cursor-not-allowed"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.idExterno || opt.value} value={opt.idExterno || opt.value}>
                        {opt.nome || opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}   