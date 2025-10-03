import { useNavigate } from "react-router-dom";
import { InputSenha } from "../atoms/InputSenha";
import { FcGoogle } from 'react-icons/fc'

export function Cadastro() {
    const navigate = useNavigate();

    return (
        // Div Global
        <div className="flex min-h-screen">
            {/* lado esquero */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[55%] flex flex-col gap-5">
                    <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
                    <div className="flex items-center justify-between relative">
                        <div className="border border-diacono-blue-100 w-full absolute top-3 z-0"></div>
                        <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
                            <div className="bg-diacono-blue-400 w-8 h-8 text-white rounded-full flex justify-center items-center">1</div>
                            <span className="text-sm text-diacono-blue-200 font-medium">Dados Básicos</span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-1/2 gap-2 z-10">
                            <div className="bg-diacono-blue-50 border border-diacono-blue-100 w-8 h-8 text-diacono-blue-200 rounded-full flex justify-center items-center">2</div>
                            <span className="text-sm text-diacono-blue-200 font-medium">Informações Complementares</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label className="text-diacono-blue-400">Nome Completo</label>
                            <input type="text" className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]" placeholder="Digite seu nome" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-1">
                                <label className="text-diacono-blue-400">Data de Nascimento</label>
                                <input type="date" className="text-diacono-blue-200 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:text-diacono-blue-400 focus:border-3 text-[14px]"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-diacono-blue-400">CPF</label>
                                <input type="text" className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]" placeholder="Digite seu CPF" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-diacono-blue-400">Email</label>
                            <input type="text" className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-5 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]" placeholder="Digite seu email" />
                        </div>
                        <div className="flex justify-between">
                            <InputSenha texto="Senha" placeholder="Digite sua senha" />
                            <InputSenha texto="Confirmar Senha" placeholder="Confirme a senha" />
                        </div>
                        <div className='flex flex-col gap-3 items-end'>
                            <button className="bg-diacono-blue-300 text-surface-50 rounded-lg w-[35%] h-12 font-semibold">Próximo</button>
                            <button className="bg-[#CEDAEA] h-12 flex items-center justify-center w-full gap-2 rounded-lg font-semibold"><FcGoogle className="text-2xl" />Entrar com o Google</button>
                            <div className="flex w-full justify-center gap-1">
                                <span className="text-diacono-blue-200">Já tem uma Conta? </span>
                                <span className="text-secondary-200 cursor-pointer" onClick={() => navigate('/login')}>Acessar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Lado direito */}
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <div className='w-[90%] h-[90%] flex flex-col justify-between items-end'>
                    <img src="./logoDiacono.png" alt="logo da diácono" className='cursor-pointer w-[25%] opacity-90' />
                    <div className='flex flex-col items-end text-white font-light italic text-5xl'>
                        <span>Sua missão,</span>
                        <span className='opacity-75'>nossa gestão:</span>
                        <span className='opacity-50'>bem-vindo ao</span>
                        <span className='opacity-25'>Diácono!</span>
                    </div>
                </div>
            </div>
        </div>

    );
}