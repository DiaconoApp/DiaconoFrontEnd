export function SelectIcf({ onChange, className = "", options = [], value }) {
    return (
        <div className={`flex flex-col ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="text-icf-primary-400 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 p-4 focus:border-icf-primary-200 focus:border-3 w-full text-[14px]"
            >
                <option value="Todos">Todos os ministérios</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.nomeMinisterio}>
                        {opt.nomeMinisterio}
                    </option>
                ))}
            </select>
        </div>
    );
}   