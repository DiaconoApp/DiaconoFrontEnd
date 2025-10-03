import { FcGoogle } from 'react-icons/fc'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

export function FormsLogin() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="w-100 h-auto flex flex-col gap-8">
            <span className="font-bold text-[28px] text-diacono-blue-400">Acesse sua conta</span>
            <div className='flex flex-col gap-6'>
                <div className="flex flex-col gap-1">
                    <span className="text-diacono-blue-400">Email</span>
                    <input type="text" placeholder="exemplo@hotmail.com" className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-diacono-blue-400">Senha</span>
                    <div className="relative">
                        <input type={mostrarSenha ? "text" : "password"} placeholder="Digite sua senha" className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 w-full text-[14px]" />
                        <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-4 text-gray-500 hover:text-gray-700">
                            {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    <div className='flex justify-end'>
                        <span className="cursor-pointer flex text-diacono-blue-200">Esqueci minha senha</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-6'>
                <button className="bg-diacono-blue-300 text-surface-50 rounded-lg w-full h-12 font-semibold">Entrar</button>
                <button className="bg-[#CEDAEA] h-12 flex items-center justify-center w-full gap-2 rounded-lg font-semibold"><FcGoogle className="text-2xl" />Entrar com o Google</button>
                <div className="flex justify-center gap-1">
                    <span className="text-diacono-blue-200">Não tem uma Conta? </span>
                    <span className="text-secondary-200 cursor-pointer" onClick={() => navigate('/cadastro')}>Cadastre-se</span>
                </div>
            </div>
        </div>
    )
}