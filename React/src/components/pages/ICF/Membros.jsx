import { Menu } from "../../templates/ICF/Menu";
import { useState } from "react";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";
import { ListaMembros } from "../../templates/ICF/ListaMembros";

export function Membros() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300 ${espacamento}`}>
                <TituloPagina titulo="Membros" descricao="Gerencie todos os membros da igreja" />
            </div>
            <div className={`${espacamento} px-6`}>
                <ListaMembros />
            </div>
        </div>
    );
}