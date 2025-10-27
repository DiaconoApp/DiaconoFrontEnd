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
            <div className={`${espacamento} mt-18  transition-all duration-300 px-6`}>
                <Calendario className="h-100 w-100" />
            </div>
        </div>
    );
}