import { useNavigate } from "react-router-dom";
import { BotaoDiacono } from "../atoms/BotaoDiacono";
import { TelaAzulDiacono } from "../molecules/TelaAzulDiacono";

export function Cadastro1() {
    const navigate = useNavigate();
    return (
        // Div Global
        <div className="flex min-h-screen">
            {/* lado esquero */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[55%] flex flex-col gap-5">
                    <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
                    <label className="text-diacono-blue-400">Qual a sua igreja?</label>
                    <select className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-12 p-3 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]">
                        <option value="" selected disabled>Selecione uma igreja</option>
                    </select>
                    <BotaoDiacono onClick={() => navigate('/cadastro2')}>Próximo</BotaoDiacono>
                </div>
            </div>


            {/* Lado direito */}
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <TelaAzulDiacono />
            </div>
        </div>

    );
}