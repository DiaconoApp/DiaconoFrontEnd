import React from 'react'
import { BotaoIcf } from '../../atoms/ICF/BotaoIcf'

export function CardEscala({
    nomeEvento,
    status,
    dataHoraInicio,
    dataHoraFim,
    ministeriosConfirmados,
    ministeriosEscalados,
    className = "",
    onVerDetalhes
}) {
    return (
        <div className="border-icf-primary-200 border rounded-2xl w-[30%] p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-icf-primary-400 font-bold">{nomeEvento}</span>
                <div className={`${className}`}>{status}</div>
            </div>
            <span>Início: {dataHoraInicio}</span>
            <span>Fim: {dataHoraFim}</span>
            <span>
                {ministeriosConfirmados}/{ministeriosEscalados} Ministérios Confirmados
            </span>
            <div className="flex gap-4">
                <BotaoIcf className="bg-icf-primary-400" onClick={onVerDetalhes}>
                    Ver Detalhes
                </BotaoIcf>
                <BotaoIcf className="bg-icf-primary-200">Gerenciar Escala</BotaoIcf>
            </div>
        </div>
    );
}
