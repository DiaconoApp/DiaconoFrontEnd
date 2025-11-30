import React from 'react'
import { BotaoIcf } from '../../atoms/ICF/BotaoIcf'

export function CardEscala({ nomeEvento, statusEscala, dataEvento, horario, ministeriosConfirmados, ministeriosTotaisEscalados, className = "" }) {
    return (
        <div className='border-icf-primary-200 border rounded-2xl w-[30%] p-5 flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <span className='text-icf-primary-400 font-bold'>Reunião</span>
                <div className={`${className}`}>Pendente</div>
            </div>
            <span>11/09 - Quinta</span>
            <span>19:00 - 21:00</span>
            <span>0/7 Ministérios Confirmados</span>
            <div className='flex gap-4'>
                <BotaoIcf className='bg-icf-primary-400'>Ver Detalhes</BotaoIcf>
                <BotaoIcf className='bg-icf-primary-200'>Gerenciar Escala</BotaoIcf>
            </div>
        </div>
    )
}
