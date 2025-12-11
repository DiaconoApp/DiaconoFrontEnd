import { Menu } from "../../templates/ICF/Menu";
import { useState } from "react";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";
import { ListaMinisterios } from "../../templates/ICF/ListaMinisterios";
import { ListaMinisterioMembro } from "../../templates/ICF/ListaMinisterioMembro";

export function Ministerios() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    let cargo = localStorage.getItem("cargo");

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <TituloPagina titulo="Ministerios" descricao="Gerencie todos os membros da igreja" />
            </div>
            <div className={`${espacamento} px-6`}>
                {cargo === "GOVERNO" ? <ListaMinisterios /> : <ListaMinisterioMembro />}
            </div>
        </div>
    );
}