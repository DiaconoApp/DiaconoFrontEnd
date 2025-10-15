import { FiRepeat } from "react-icons/fi";
import { BotaoSemana } from "../../atoms/ICF/BotaoSemana";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf"
import { TituloModal } from "../../atoms/ICF/TituloModal";

export function ModalRecorrente() {
    const numeros = [1,2,3,4,5,6,7,8,9,10]
    return (
        <body className="bg-blue-400 flex items-center justify-center h-screen">
            <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
                <div className="w-[90%] flex flex-col gap-4">
                    <TituloModal titulo={"Repetir"}/>
                    <div className="border border-icf-primary-50"></div>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-7">
                            <label className="text-icf-primary-400">Iniciar</label>
                            <input type="date" className="border-b-2 border-b-icf-primary-50 text-icf-primary-300 focus:outline-none focus:border-b-icf-primary-100" />
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-4">
                                <FiRepeat className="text-lg text-icf-primary-400" />
                                <label className="text-icf-primary-300">Repetir a cada</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="text-icf-primary-300 rounded-[2px] p-2 bg-icf-primary-100">
                                    {numeros.map((opt) =>(
                                        <option value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <select className="text-icf-primary-300 rounded-[2px] p-2 bg-icf-primary-100">
                                    <option value="semana">Semana</option>
                                    <option value="dia">Dia</option>
                                    <option value="mes">Mês</option>
                                    <option value="ano">Ano</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <BotaoSemana />
                        </div>
                        <div className="flex justify-center gap-6">
                            <div className="w-[75%] flex gap-4">
                                <BotaoIcf className="bg-icf-primary-400">Salvar</BotaoIcf>
                                <BotaoIcf className="bg-icf-primary-200">Descartar</BotaoIcf>
                                <button className="rounded-lg h-10 w-full border border-icf-primary-200 text-icf-primary-200">Remover</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
}