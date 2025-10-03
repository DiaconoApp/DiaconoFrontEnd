import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export function InputSenha(props) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    return (
        <div className="flex flex-col gap-1">
            <span className="text-diacono-blue-400">{props.texto}</span>
            <div className="relative">
                <input type={mostrarSenha ? "text" : "password"} placeholder={props.placeholder} className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 w-full text-[14px]" />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-4 text-gray-500 hover:text-gray-700">
                    {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
        </div>
    )
}