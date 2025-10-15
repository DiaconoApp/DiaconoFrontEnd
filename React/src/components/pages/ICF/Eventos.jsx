import { Menu } from "../../templates/ICF/Menu";
import { Kpi } from "../../molecules/ICF/Kpi";
import { Calendario } from "../../templates/ICF/Calendario";
import { useState } from "react";

export function Eventos() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <Kpi imagem="calendario" className="flex-1" />
                <Kpi imagem="calendario" className="flex-1" />
                <Kpi imagem="calendario" className="flex-1" />
            </div>
            <div className={`${espacamento} px-6`}>
                <Calendario className="h-100 w-100" />
            </div>
        </div>
    );
}