import { User, Calendar, MapPin, Ticket, FileText, Users, Tag, Clock } from "lucide-react";
import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";

function InfoRow({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-icf-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-icf-primary-400" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-semibold text-icf-primary-200 uppercase tracking-widest">{label}</span>
                <span className="text-sm font-medium text-icf-primary-400">{children}</span>
            </div>
        </div>
    );
}

export function ModalVisualizarEvento({ evento, onClose, onEdit }) {
    if (!evento) return null;

    const cargo = localStorage.getItem("cargo");
    const podeEditar = cargo === "LIDER_MINISTERIO" || cargo === "GOVERNO";

    const dataInicioObj = evento?.dataInicio ? new Date(evento.dataInicio) : null;
    const dataFimObj = evento?.dataFim ? new Date(evento.dataFim) : null;
    const dataInicioValida = dataInicioObj && !isNaN(dataInicioObj);
    const dataFimValida = dataFimObj && !isNaN(dataFimObj);

    const ehMesmoDia = dataInicioValida && dataFimValida
        ? dataInicioObj.toDateString() === dataFimObj.toDateString()
        : true;

    const formatarData = (data) => {
        if (!data || isNaN(data)) return "Não informado";
        return data.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatarDataHora = (data) => {
        if (!data || isNaN(data)) return "Não informado";
        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const gratuito = evento.custo === 0 || !evento.custo;

    return (
        <BaseModal
            title={evento.titulo}
            onClose={onClose}
            size="md"
            footer={
                podeEditar && (
                    <Button onClick={onEdit} className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white">
                        Editar
                    </Button>
                )
            }
        >
            <div className="space-y-4">

                {/* Organizador */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-icf-primary-50 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-icf-primary-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-icf-primary-200 uppercase tracking-widest">Organizador</p>
                        <p className="text-sm font-medium text-icf-primary-400">{evento.organizador || "Não informado"}</p>
                    </div>
                </div>

                <div className="border-t border-icf-primary-50" />

                {/* Badges */}
                {(evento.publicoAlvo || evento.ministerios?.length > 0) && (
                    <>
                        <div className="flex flex-wrap gap-2">
                            {evento.publicoAlvo && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-icf-primary-400 bg-icf-primary-50 px-3 py-1.5 rounded-full">
                                    <Users className="w-3 h-3" />
                                    {evento.publicoAlvo}
                                </span>
                            )}
                            {evento.ministerios?.map((m, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold text-icf-primary-400 bg-icf-primary-50 px-3 py-1.5 rounded-full">
                                    <Tag className="w-3 h-3" />
                                    {m.nome || m}
                                </span>
                            ))}
                        </div>
                        <div className="border-t border-icf-primary-50" />
                    </>
                )}

                {/* Data e Horário — agrupados */}
                {ehMesmoDia ? (
                    <div className="bg-icf-primary-50 rounded-xl p-4 space-y-3">
                        <InfoRow icon={Calendar} label="Data">
                            <span className="capitalize">{dataInicioValida ? formatarData(dataInicioObj) : "Não informado"}</span>
                        </InfoRow>
                        <InfoRow icon={Clock} label="Horário">
                            {evento.horaInicio || "00:00"} até {evento.horaFim || "00:00"}
                        </InfoRow>
                    </div>
                ) : (
                    <div className="bg-icf-primary-50 rounded-xl p-4 space-y-3">
                        <InfoRow icon={Calendar} label="Início">{formatarDataHora(dataInicioObj)}</InfoRow>
                        <InfoRow icon={Calendar} label="Fim">{formatarDataHora(dataFimObj)}</InfoRow>
                    </div>
                )}

                <div className="border-t border-icf-primary-50" />

                {/* Ingresso e Local */}
                <InfoRow icon={Ticket} label="Ingresso">
                    <span className={gratuito ? "text-green-600" : ""}>
                        {gratuito ? "Gratuito" : `R$ ${evento.custo}`}
                    </span>
                </InfoRow>

                <InfoRow icon={MapPin} label="Local">
                    {evento.local || "Não informado"}
                </InfoRow>

                {/* Descrição */}
                {evento.descricao && (
                    <>
                        <div className="border-t border-icf-primary-50" />
                        <InfoRow icon={FileText} label="Descrição">
                            <span className="font-normal leading-relaxed">{evento.descricao}</span>
                        </InfoRow>
                    </>
                )}

            </div>
        </BaseModal>
    );
}
