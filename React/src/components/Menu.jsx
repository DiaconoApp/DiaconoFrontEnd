// import { useState } from 'react';
import { ItemMenuLateral } from './ItemMenuLateral';
import { ItemMenuTopo } from './ItemMenuTopo';

export function Menu({menuAberto, setMenuAberto}) {

    return (
        <nav className='fixed top-0 left-0'>
            {/* MENU TOPO */}
            <div className='border-b-[0.5px] border-icf-primary-100 h-15 w-full bg-white fixed z-0'>
                <div className='flex justify-end items-center content-center gap-4 h-full pr-4.5 relative z-20'>
                    <ItemMenuTopo
                        imagem="calendario"
                    />
                    <ItemMenuTopo
                        imagem="calendario"
                    />
                    <div className='flex flex-col items-center'>
                        <span className='text-sm font-bold text-icf-primary-400'>João Souza</span>
                        <span className='text-[10px] text-icf-primary-300 font-light tracking-[0.5px]' >Administrador</span>
                    </div>
                </div>
            </div>

            {/* MENU LATERAL */}
            <div className={`bg-white h-screen shadow-menu-shadow transition-all duration-400 gap-6 flex flex-col relative z-30
                ${menuAberto ? "w-70" : "w-24.5 px-3"}`
            }>
                <div className='flex justify-center items-center gap-1.5 pb-4 py-3'>
                    <img src="./public/logoICF.png" alt="Logo da Igreja Cristã da Familia" />
                    {menuAberto && (
                        <img src="./public/LogotipoICF.png" alt="Logotipo da Cristã da Familia, contendo o nome e o slogan 'Formando Jesus em Nós'"/>
                    )}
                </div>
                <button onClick={() => setMenuAberto(!menuAberto)}
                    className={`px-2 py-2 border-icf-primary-200 border cursor-pointer
                    rounded-full ml-7 fixed top-6 bg-white transition-all duration-450 ease-in-out
                    ${menuAberto ? "left-60" : "left-15 rotate-180"}`}>
                    <img src="./public/seta.png" alt="icone de seta" />
                </button>
                <div className='gap-6 flex flex-col'>
                <ul className={`gap-2 flex flex-col ${menuAberto ? "px-6" : "px-3"}`}>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                      <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                </ul>
                <hr className='border border-icf-primary-100'/>
                <ul className={`gap-2 flex flex-col ${menuAberto ? "px-6" : "px-3"}`}>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                    <li>
                        <ItemMenuLateral
                            label={menuAberto ? "Calendário" : false}
                            imagem="calendario"
                            href="teste"
                        />
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
} 