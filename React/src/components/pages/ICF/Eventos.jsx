import { Menu } from "../../templates/ICF/Menu";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function Eventos() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`${espacamento} mt-18  transition-all duration-300 px-6`}>
                <Outlet context={{ menuAberto }}/>
            </div>
        </div>
    );
}