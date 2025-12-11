import { useState, useEffect } from 'react';
import { ItemMenuLateral } from '../../molecules/ICF/ItemMenuLateral';
import { ItemMenuTopo } from '../../molecules/ICF/ItemMenuTopo';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/login';
import { formatarCargo, transformationName } from '../../../utils/Utils';
import { usePermission } from "../../../hooks/usePermission";

export function Menu({ menuAberto, setMenuAberto }) {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("");
    const { can } = usePermission();

    const menuItems = [
        { key: "eventos", label: "Calendário", imagem: "calendario", onClick: () => navigate('/eventos') },
        { key: "escalas", label: "Escalas", imagem: "iconeEscala", onClick: () => navigate('/escalas') },
        { key: "membros", label: "Membros", imagem: "iconeGrupo", onClick: () => navigate('/membros') },
        { key: "ministerios", label: "Ministérios", imagem: "iconeTerra", onClick: () => navigate('/ministerios') },
        { key: "dashboards", label: "Dashboard", imagem: "iconeDash", onClick: () => navigate('/dashboard') },
        { key: "", label: "Financeiro", imagem: "iconeFinanceiro" },
    ];

    const configItems = [
        { label: "Configurações", imagem: "iconeConfig" },
        { label: "Sair", imagem: "iconeSair", onClick: logout },
    ];

    useEffect(() => {
        const nomeSalvo = localStorage.getItem("nome") || "";
        setNome(nomeSalvo);

        const cargoSalvo = localStorage.getItem("cargo") || "";
        setCargo(cargoSalvo);
    }, []);

    return (
        <nav className='fixed top-0 left-0'>
            {/* MENU TOPO */}
            <div className='border-b-[0.5px] border-icf-primary-100 h-15 w-full bg-white fixed z-0'>
                <div className='flex justify-end items-center content-center gap-4 h-full pr-4.5 relative z-20'>
                    <ItemMenuTopo
                        imagem="iconeNotificacao"
                    />
                    <ItemMenuTopo
                        imagem="iconePerfil"
                    />
                    <div className='flex flex-col'>
                        <span className='text-sm font-bold text-icf-primary-400'>{transformationName(nome)}</span>
                        <span className='text-[10px] text-icf-primary-300 font-light tracking-[0.5px]'>{formatarCargo(cargo)}</span>
                    </div>
                </div>
            </div>

            {/* MENU LATERAL */}
            <div className={`bg-white h-screen shadow-menu-shadow transition-all duration-400 gap-6 flex flex-col relative z-30
                ${menuAberto ? "w-70" : "w-24.5 px-3"}`
            }>
                <div className='flex justify-center items-center gap-1.5 pb-4 py-3'>
                    <img src="/logoICF.png" alt="Logo da Igreja Cristã da Familia" />
                    {menuAberto && (
                        <img src="/LogotipoICF.png" alt="Logotipo da Cristã da Familia, contendo o nome e o slogan 'Formando Jesus em Nós'" />
                    )}
                </div>
                <button onClick={() => setMenuAberto(!menuAberto)}
                    className={`px-2 py-2 border-icf-primary-200 border cursor-pointer
                    rounded-full ml-7 fixed top-6 bg-white transition-all duration-450 ease-in-out
                    ${menuAberto ? "left-60" : "left-15 rotate-180"}`}>
                    <img src="/seta.png" alt="icone de seta" />
                </button>
                <div className='gap-6 flex flex-col'>
                    <ul className={`gap-2 flex flex-col ${menuAberto ? "px-6" : "px-3"} cursor-pointer`}>
                        {menuItems.map((item, index) => (
                            can(item.key) && (
                                <li key={index}>
                                    <ItemMenuLateral
                                        label={menuAberto ? item.label : false}
                                        imagem={item.imagem}
                                        onClick={item.onClick}
                                    />
                                </li>
                            )
                        ))}
                    </ul>
                    <hr className='border border-icf-primary-100' />
                    <ul className={`gap-2 flex flex-col ${menuAberto ? "px-6" : "px-3"} cursor-pointer`}>
                        {configItems.map((item, index) => (
                            <li key={index}>
                                <ItemMenuLateral
                                    label={menuAberto ? item.label : false}
                                    imagem={item.imagem}
                                    onClick={item.onClick}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
} 