import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export function InputSenhaIcf({texto, placeholder, children, ...props}) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    return (
        <div className="flex flex-col gap-1">
            <span className="text-icf-primary-400">{texto}</span>
            <div className="relative">
                <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder={placeholder}
                    className="text-icf-primary-400 border border-icf-primary-200 bg-surface-50 rounded-lg h-10 p-5 focus:outline-none focus:border-icf-primary-200 focus:border-3 w-full text-[14px]"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                    {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {children}
        </div>
    )
}