import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export function InputSenhaIcf({ label, texto, placeholder, className = "", children, ...props }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const displayLabel = label || texto; // Suporta ambos para compatibilidade
    
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {displayLabel && (
                <label className="text-sm font-medium text-icf-primary-400">{displayLabel}</label>
            )}
            <div className="relative">
                <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder={placeholder}
                    className={`w-full text-sm text-icf-primary-400 placeholder:text-icf-primary-200 bg-surface-50 border border-icf-primary-100 rounded-lg h-10 px-4 pr-12 focus:outline-none focus:border-icf-primary-300 transition-colors ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-icf-primary-200 hover:text-icf-primary-400 transition-colors">
                    {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {children}
        </div>
    )
}