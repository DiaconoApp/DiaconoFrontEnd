import { useState } from 'react';
import { FiX } from "react-icons/fi";

export function BotaoSemana() {
    const labels = [
        { letra: "S", semana: "Segunda" },
        { letra: "T", semana: "Terça" },
        { letra: "Q", semana: "Quarta" },
        { letra: "Q", semana: "Quinta" },
        { letra: "S", semana: "Sexta" },
        { letra: "S", semana: "Sábado" },
        { letra: "D", semana: "Domingo" }
    ];
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (dia) => {
        setSelectedItems((prev) =>
            prev.includes(dia) ? prev.filter((item) => item !== dia) : [...prev, dia]
        );
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-2">
                {labels.map(({ letra, semana }) => {
                    const isSelected = selectedItems.includes(semana);
                    return (
                        <button
                            key={semana}
                            onClick={() => toggleItem(semana)}
                            className={`w-10 h-10 rounded-full transition 
                        ${isSelected ? 'bg-icf-primary-300 text-icf-primary-50' : 'bg-icf-primary-100 text-icf-primary-300'}`}
                        >
                            {letra}
                        </button>
                    );
                })}
            </div>
            <div className='flex flex-col gap-2'>
                <label className='font-bold text-icf-primary-300'>Ocorre a cada Domingo até</label>
                <div className='flex gap-7'>
                    <input type="date" className='text-icf-primary-200 font-semibold text-sm w-30 focus:outline-none border-b-2 border-b-icf-primary-50 focus:border-b-icf-primary-100' />
                    <button className='text-icf-primary-200 font-semibold text-sm flex items-center gap-1'>Remover a data do término <FiX></FiX></button>
                </div>
            </div>
        </div>
    );
}