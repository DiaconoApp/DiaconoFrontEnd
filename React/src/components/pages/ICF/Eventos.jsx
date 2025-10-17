import { Menu } from "../../templates/ICF/Menu";
import { Calendario } from "../../templates/ICF/Calendario";
import { useState } from "react";
import api from "../../../provider/api"
import { useEffect } from "react";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";

export function Eventos() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    const [data, setData] = useState([]);

    useEffect(() => {
        buscarEventos()
    }, []);

    function buscarEventos() {
        api.get("/eventos?mes=12&ano=2025")
            .then((response) => {
                setData(response.data);
                console.log(response.data)
            })
            .catch((err) => console.log("Erro ao buscar os eventos:", err));
    }

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <TituloPagina titulo="Calendário de Eventos" descricao="Gerencie todos os eventos da igreja"/>
            </div>
            <div className={`${espacamento} px-6`}>
                <Calendario className="h-100 w-100" />
            </div>
        </div>
    );
}