import { Menu } from "../../templates/ICF/Menu";
import { useState, useEffect } from "react";
import { TituloPagina } from "../../atoms/ICF/TituloPagina";
import { InputBuscar } from "../../atoms/ICF/InputBuscar";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { buscarMinisterios } from "../../../services/ministerios";
import { CardEscala } from "../../molecules/ICF/CardEscala";

export function Escalas() {
    const [menuAberto, setMenuAberto] = useState(true);
    var espacamento = menuAberto ? "ml-70" : "ml-24.5";
    const [fkMinisterio, setFkMinisterio] = useState("");

    // Listar os ministérios no select
    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisterios().then(setOptions);
    }, []);

    return (
        <div className='bg-[#F6F7F9] flex flex-col h-screen w-full pb-6'>
            <Menu menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            <div className={`grid grid-cols-3 gap-5  mt-15 p-6 transition-all duration-300
            ${espacamento}`}>
                <TituloPagina titulo="Escalas" descricao="Gerencie todas as escalas dos ministérios" />
            </div>
            <div className={`${espacamento} px-6`}>
                <div className="bg-white p-4 flex flex-col gap-5">
                    <div className="flex items-center justify-center gap-5">
                        <div className="w-[33%]">
                            <InputBuscar placeholder="Buscar por nome do evento" />
                        </div>
                        <div className="w-[33%]">
                            <SelectIcf
                                opt1={<option value="todos">Todos os status</option>}
                                opt2={<option value="concluidas">Concluídas</option>}
                                opt3={<option value="pendentes">Pendentes</option>}
                            />
                        </div>
                        <div className="w-[33%]">
                            <SelectIcf
                                opt1={<option value="">Todos os ministérios</option>}
                                options={options}
                                value={fkMinisterio}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between flex-wrap gap-5">
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                        <CardEscala />
                    </div>
                </div>
            </div>
        </div>
    );
}