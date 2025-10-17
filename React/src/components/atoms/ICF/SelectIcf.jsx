import { useEffect, useState } from "react";

export function SelectIcf({
    value,
    onChange,
    fetchOptions,
    className = ""
}) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (fetchOptions) {
            fetchOptions()
                .then((res) => setOptions(res))
                .catch((err) => console.error("Erro ao carregar opções:", err))
                .finally(() => setLoading(false));
        }
    }, [fetchOptions]);

    return (
        <div className={`flex flex-col ${className}`}>
            <select
                value={value}
                onChange={onChange}
                className="text-icf-primary-400 bg-surface-50 border border-icf-primary-200 rounded-lg py-3 p-4 focus:border-icf-primary-200 focus:border-3 w-full text-[14px]"
            >
                <option value="0">Todos os ministérios</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.value}
                    </option>
                ))}
            </select>
        </div>
    );
}