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
    eventoId,
    isGoverno = false
}) {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const parseDataHora = (dataStr) => {
        if (!dataStr) return null;

        const dataNativa = new Date(dataStr);
        if (!isNaN(dataNativa)) return dataNativa;

        const match = String(dataStr).match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2})$/);
        if (!match) return null;

        const [, dia, mes, ano, hora, minuto] = match;
        const dataConvertida = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
        return !isNaN(dataConvertida) ? dataConvertida : null;
    };

    const formatarDataHoraCompleta = (data) => {
        if (!data) return "";
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const diaSemana = diasSemana[data.getDay()];
        return `${diaSemana} - ${dia}/${mes} - ${hora}:${minutos}`;
    };

    const formatarDataMesmoDia = (data) => {
        if (!data) return "";
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const diaSemana = diasSemana[data.getDay()];
        return `${diaSemana} - ${dia}/${mes}`;
    };

    const formatarHorario = (data) => {
        if (!data) return "";
        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${hora}:${minutos}`;
    };

    const getStatusColor = (statusStr) => {
        if (!statusStr) return "bg-icf-primary-200";
        const statusUpper = String(statusStr).toUpperCase();
        if (statusUpper === "PENDENTE") return "bg-warning-200";
        if (statusUpper === "CONFIRMADO") return "bg-success-500";
        if (statusUpper === "CONCLUIDO") return "bg-icf-primary-200";
        return "bg-icf-primary-200";
    };

    const textoConfirmacao = isGoverno ? "ministérios confirmados" : "membros confirmados";
    const textoBotaoGerenciar = isGoverno ? "Gerenciar Ministérios" : "Gerenciar Escala";

    const dataInicioObj = parseDataHora(dataHoraInicio);
    const dataFimObj = parseDataHora(dataHoraFim);
    const mesmoDia = dataInicioObj && dataFimObj
        ? dataInicioObj.toDateString() === dataFimObj.toDateString()
        : false;

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

            {mesmoDia ? (
                <>
                    <div className="text-sm text-icf-primary-200">
                        {formatarDataMesmoDia(dataInicioObj)}
                    </div>
                    <div className="text-sm text-icf-primary-200">
                        {formatarHorario(dataInicioObj)} - {formatarHorario(dataFimObj)}
                    </div>
                </>
            ) : (
                <>
                    {/* Início */}
                    <div className="text-sm text-icf-primary-200">
                        <strong>Início:</strong> {dataInicioObj ? formatarDataHoraCompleta(dataInicioObj) : dataHoraInicio}
                    </div>

                    {/* Fim */}
                    <div className="text-sm text-icf-primary-200">
                        <strong>Fim:</strong> {dataFimObj ? formatarDataHoraCompleta(dataFimObj) : dataHoraFim}
                    </div>
                </>
            )}

            {/* Ministérios */}
            <div className="text-sm text-icf-primary-200">
                {ministeriosConfirmados}/{ministeriosEscalados} {textoConfirmacao}
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
                    {textoBotaoGerenciar}
                </BotaoIcf>
            </div>
        </div>
    );
}
