import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function InfoLabel({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-icf-primary-300 uppercase tracking-wide">{label}</span>
            <span className="text-icf-primary-400 text-sm">{children}</span>
        </div>
    );
}

export function ModalVisualizarEvento({ evento, onClose, onEdit }) {
    if (!evento) return null;

    const cargo = localStorage.getItem("cargo");
    const podeEditar = cargo === "LIDER_MINISTERIO" || cargo === "GOVERNO";

    return (
        <div className="bg-white rounded-xl shadow-xl w-[480px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-icf-primary-50">
                <h2 className="font-bold text-xl text-icf-primary-400">{evento.titulo}</h2>
                <button 
                    onClick={onClose} 
                    className="p-1 hover:bg-icf-primary-50 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-icf-primary-300" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Organizador */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-icf-primary-300 uppercase tracking-wide">Organizador</span>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-icf-primary-50 flex items-center justify-center">
                            <User className="w-4 h-4 text-icf-primary-300" />
                        </div>
                        <span className="text-icf-primary-400 text-sm">{evento.organizador || "Não informado"}</span>
                    </div>
                </div>

                <InfoLabel label="Nome do Evento">{evento.titulo}</InfoLabel>
                <InfoLabel label="Público-Alvo">{evento.publicoAlvo || "Geral"}</InfoLabel>
                
                {evento.ministerios && evento.ministerios.length > 0 && (
                    <InfoLabel label="Escala">
                        {evento.ministerios.map(m => m.nome || m).join(", ")}
                    </InfoLabel>
                )}

                {/* Data e Horários */}
                <div className="grid grid-cols-3 gap-4">
                    <InfoLabel label="Data">
                        {new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
                    </InfoLabel>
                    <InfoLabel label="Início">{evento.horaInicio || "00:00"}</InfoLabel>
                    <InfoLabel label="Fim">{evento.horaFim || "00:00"}</InfoLabel>
                </div>

                {/* Recorrência - comentado por enquanto */}
                {/* <p className="text-icf-primary-200 text-sm italic">Ocorre a cada Sábado até o dia de XX/XXXX</p> */}

                {/* Valor e Local */}
                <div className="grid grid-cols-2 gap-4">
                    <InfoLabel label="Valor do Ingresso">
                        {evento.custo === 0 || !evento.custo ? "Gratuito" : `R$ ${evento.custo}`}
                    </InfoLabel>
                    <InfoLabel label="Local">{evento.local || "Não informado"}</InfoLabel>
                </div>

                <InfoLabel label="Descrição">
                    {evento.descricao || "Sem descrição"}
                </InfoLabel>
            </div>

            {/* Footer */}
            {podeEditar && (
                <div className="p-6 pt-0 flex justify-end">
                    <Button
                        onClick={onEdit}
                        className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
                    >
                        Editar
                    </Button>
                </div>
            )}
        </div>
    );
}