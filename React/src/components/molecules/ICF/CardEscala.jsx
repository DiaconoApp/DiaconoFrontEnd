import React from 'react'
import { BotaoIcf } from '../../atoms/ICF/BotaoIcf'

export function CardEscala({
    nomeEvento,
    nomeMinisterio,
    status,
    dataHoraInicio,
    dataHoraFim,
    ministeriosConfirmados,
    ministeriosEscalados,
    className = "",
    onVerDetalhes,
    onGerenciarMinisterios,
    eventoId
}) {
    // Formata data e hora completa com dia da semana
    const formatarDataHoraCompleta = (dataStr) => {
        if (!dataStr) return "";
        try {
            const date = new Date(dataStr);
            if (!isNaN(date)) {
                const dia = String(date.getDate()).padStart(2, '0');
                const mes = String(date.getMonth() + 1).padStart(2, '0');
                const hora = String(date.getHours()).padStart(2, '0');
                const minutos = String(date.getMinutes()).padStart(2, '0');
                const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                const diaSemana = diasSemana[date.getDay()];
                return `${diaSemana} ${dia}/${mes} - ${hora}h`;
            }
        } catch (e) {
            return dataStr;
        }
        return dataStr;
    };

    const getStatusColor = (statusStr) => {
        if (!statusStr) return "bg-icf-primary-200";
        const statusUpper = String(statusStr).toUpperCase();
        if (statusUpper === "PENDENTE") return "bg-warning-200";
        if (statusUpper === "CONFIRMADO") return "bg-success-500";
        if (statusUpper === "CONCLUIDO") return "bg-icf-primary-200";
        return "bg-icf-primary-200";
    };

    return (
        <div className={`bg-white border border-icf-primary-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow h-full ${className}`}>
            {/* Header com título e badge de status */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-icf-primary-400 leading-tight">
                        {nomeEvento}
                    </h3>
                    {nomeMinisterio && (
                        <span className="inline-flex w-fit items-center rounded-full bg-icf-primary-50 px-3 py-1 text-xs font-semibold text-icf-primary-300">
                            {nomeMinisterio}
                        </span>
                    )}
                </div>
                <span className={`${getStatusColor(status)} text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
                    {status}
                </span>
            </div>

            {/* Início */}
            <div className="text-sm text-icf-primary-200">
                <strong>Início:</strong> {formatarDataHoraCompleta(dataHoraInicio)}
            </div>

            {/* Fim */}
            <div className="text-sm text-icf-primary-200">
                <strong>Fim:</strong> {formatarDataHoraCompleta(dataHoraFim)}
            </div>

            {/* Ministérios */}
            <div className="text-sm text-icf-primary-200">
                {ministeriosConfirmados}/{ministeriosEscalados} membros confirmados
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-2">
                <BotaoIcf 
                    className="bg-icf-primary-400 flex-1 text-white font-semibold py-2" 
                    onClick={onVerDetalhes}
                >
                    Ver Detalhes
                </BotaoIcf>
                <BotaoIcf 
                    className="bg-icf-primary-100 flex-1 text-icf-primary-400 font-semibold py-2"
                    onClick={onGerenciarMinisterios}
                    disabled={!onGerenciarMinisterios}
                    style={{ opacity: onGerenciarMinisterios ? 1 : 0.5, cursor: onGerenciarMinisterios ? 'pointer' : 'not-allowed' }}
                >
                    Gerenciar Escala
                </BotaoIcf>
            </div>
        </div>
    );
}
