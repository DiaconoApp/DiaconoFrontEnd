import { Config } from "./Config"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from "react"
import { FcGoogle } from 'react-icons/fc'

export function BlocoLogin() {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <div className={`w-[50%] auto flex flex-col ${Config.corAzulPrincipal} gap-7`}>
            <span className="font-bold text-3xl">Acesse sua conta</span>
            <div className="flex flex-col gap-1">
                <span className={`${Config.corLetraAzulPrincipal}`}>Email</span>
                <input type="text" placeholder="exemplo@hotmail.com" className={`${Config.input}`} />
            </div>
            <div className="flex flex-col gap-1">
                <div className={`flex justify-between`}>
                    <span className={`${Config.corLetraAzulPrincipal}`}>Senha</span>
                    <span className={`cursor-pointer text-blue-500`}>Esqueci minha senha</span>
                </div>
                <div className="relative">
                    <input type={mostrarSenha ? "text" : "password"} placeholder="Digite sua senha" className={`${Config.input} w-full`} />
                    <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className={`absolute right-3 top-5 text-gray-500 hover:text-gray-700`}>
                        {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <button className={`${Config.corFundoAzulPrincipal} text-gray-50 ${Config.arredondarBordaPequena} ${Config.alturaInput}`}>Entrar</button>
            <button className={`bg-blue-100 ${Config.alturaInput} ${Config.cetralizar} gap-2 ${Config.arredondarBordaPequena}`}><FcGoogle className="text-2xl" />Entrar com o Google</button>
            <div className={`flex justify-center gap-1`}>
                <span>Não tem uma Conta? </span>
                <span className={`text-blue-500 cursor-pointer`}>Cadastre-se</span>
            </div>
        </div>
    )
}