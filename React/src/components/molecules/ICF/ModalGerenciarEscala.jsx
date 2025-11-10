import React from 'react'
import { TituloModal } from '../../atoms/ICF/TituloModal'
import { BotaoIcf } from '../../atoms/ICF/BotaoIcf'
import { OpcaoSelecionar } from '../../atoms/ICF/OpcaoSelecionar'

export function ModalGerenciarEscala() {
    return (
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Gerenciar Escala"} />
                <div className="border border-icf-primary-50"></div>
                <div className='flex items-center h-10 justify-center text-icf-primary-300 bg-icf-primary-100 rounded p-1 text-sm'>
                    <button className='w-[50%] h-[95%] bg-surface-50 rounded'>Aleatório</button>
                    <button className='w-[50%] h-[95%] rounded'>Escolher Manualmente</button>
                </div>
                <div className='flex flex-col gap-2'>
                    <span>Tamanho da equipe</span>
                    <div className='flex gap-4'>
                        <input type="number" className='border p-1 border-icf-primary-100 rounded focus:outline-none focus:border-icf-primary-200' />
                        <BotaoIcf className='bg-icf-primary-400'>Gerar escala aleatória</BotaoIcf>
                    </div>
                </div>

                {/* Lista de membros gerados */}
                <div className='flex flex-col gap-2'>
                    <OpcaoSelecionar nome={"João Silva"} tituloBotao={"Trocar"} />
                </div>
                <button className='h-10 bg-icf-primary-200 text-surface-50 p-1 rounded'>Confirmar escala</button>
            </div>
        </div>
    )
}
