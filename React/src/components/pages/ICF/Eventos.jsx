import { Menu } from "../../templates/ICF/Menu";
import { Kpi } from "../../molecules/ICF/Kpi";
import { Calendario } from "../../templates/ICF/Calendario";
import { useState } from "react";
import api from "../../../provider/api"
import { useEffect } from "react";

export function Eventos() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    const [data, setData] = useState([]);

    useEffect(() => {
        buscarEventos()
    }, []);

    function buscarEventos() {
        api.get("/eventos")
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
                <Kpi imagem="calendario" className="flex-1" props={{ titulo: "Total de Eventos Semanal", valor: data[1]?.totalSemana }} />
                <Kpi imagem="calendario" className="flex-1" props={{ titulo: "Total de Eventos Mensal", valor: data[1]?.totalMes }} />
                <Kpi imagem="calendario" className="flex-1" props={{ titulo: "Total de Eventos Anual", valor: data[1]?.totalAno }} />
            </div>
            <div className={`${espacamento} px-6`}>
                <Calendario className="h-100 w-100" />
            </div>
        </div>
    );
}