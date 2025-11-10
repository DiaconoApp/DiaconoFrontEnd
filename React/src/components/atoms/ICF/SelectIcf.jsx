export function SelectIcf({ onChange, className = "", options = [], value, label, opt1, opt2, opt3 }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label}
            <select
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="text-icf-primary-400 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 p-4 focus:border-icf-primary-200 focus:border-3 w-full text-[14px]"
            >
                {opt1}
                {opt2}
                {opt3}
                {options.map((opt) => (
                    <option key={opt.idExterno} value={opt.idExterno}>
                        {opt.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}   