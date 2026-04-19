import { useEffect, useState } from 'react';
import { BaseModal } from '../../atoms/ICF/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { buscarMembrosEscalaLider, atualizarEscalaMembroLider, gerarEscalaAleatoriaLider } from '../../../services/escalas';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ModalGerenciarEscala({ onClose, onConfirm, idExternoEscalaEvento }) {
    const [modo, setModo] = useState('aleatorio'); // 'aleatorio' | 'manual'
    const [tamanhoEquipe, setTamanhoEquipe] = useState(3);
    const [membros, setMembros] = useState([]);
    const [membrosFiltrados, setMembrosFiltrados] = useState([]);
    const [buscaTexto, setBuscaTexto] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [membrosSelecionados, setMembrosSelecionados] = useState({});
    const [membrosSorteados, setMembrosSorteados] = useState([]);
    const [carregandoSorteio, setCarregandoSorteio] = useState(false);
    const [carregandoConfirmar, setCarregandoConfirmar] = useState(false);
    const { toast } = useToast();

    // Carregar membros quando modo muda para 'manual'
    useEffect(() => {
        if (modo === 'manual' && idExternoEscalaEvento) {
            const carregarMembros = async () => {
                try {
                    setCarregando(true);
                    const res = await buscarMembrosEscalaLider(idExternoEscalaEvento);
                    const lista = Array.isArray(res) ? res : [];
                    setMembros(lista);
                    setMembrosFiltrados(lista);

                    // Pré-selecionar membros já confirmados para permitir desmarcar no botão "Escalado"
                    const selecionadosIniciais = lista.reduce((acc, membro) => {
                        if (membro?.status === "CONFIRMADO" && membro?.membroMinisterioId) {
                            acc[membro.membroMinisterioId] = true;
                        }
                        return acc;
                    }, {});
                    setMembrosSelecionados(selecionadosIniciais);
                } catch (err) {
                    console.error("Erro ao buscar membros da escala:", err);
                    setMembros([]);
                    setMembrosFiltrados([]);
                    setMembrosSelecionados({});
                } finally {
                    setCarregando(false);
                }
            };
            carregarMembros();
        }
    }, [modo, idExternoEscalaEvento]);

    // Filtrar membros baseado na busca
    useEffect(() => {
        const filtrados = membros.filter(m =>
            m.nomeMembro?.toLowerCase().includes(buscaTexto.toLowerCase())
        );
        setMembrosFiltrados(filtrados);
    }, [buscaTexto, membros]);

    // Determinar estado do botão baseado nas regras
    const getStatusBotao = (membro) => {
        const estaSelecionado = Boolean(membrosSelecionados[membro.membroMinisterioId]);

        if (estaSelecionado) {
            return {
                label: "Escalado",
                disabled: false,
                variant: "escalado"
            };
        }
        
        if (membro.isMembroOcupado) {
            return {
                label: "Ocupado",
                disabled: true,
                variant: "ocupado"
            };
        }

        return {
            label: "Escalar",
            disabled: false,
            variant: "disponivel"
        };
    };

    // Alternar seleção de membro
    const toggleMembroSelecionado = (membroId) => {
        setMembrosSelecionados(prev => ({
            ...prev,
            [membroId]: !prev[membroId]
        }));
    };

    const handleGerarEscalaAleatoria = async () => {
        if (!idExternoEscalaEvento) {
            toast({
                title: "Erro",
                description: "Não foi possível identificar a escala do evento.",
                variant: "destructive"
            });
            return;
        }

        if (!tamanhoEquipe || Number(tamanhoEquipe) < 1) {
            toast({
                title: "Atenção",
                description: "Informe um tamanho de equipe válido.",
                variant: "destructive"
            });
            return;
        }

        try {
            setCarregandoSorteio(true);
            const sorteados = await gerarEscalaAleatoriaLider(idExternoEscalaEvento, tamanhoEquipe);
            setMembrosSorteados(sorteados);

            const selecionadosAleatorios = sorteados.reduce((acc, membro) => {
                const id = membro?.idExternoMembroMinisterio || membro?.membroMinisterioId;
                if (id) {
                    acc[id] = true;
                }
                return acc;
            }, {});

            setMembrosSelecionados(selecionadosAleatorios);

            toast({
                title: "Sucesso",
                description: "Escala aleatória gerada com sucesso!",
                variant: "success"
            });
        } catch (err) {
            console.error("Erro ao gerar escala aleatória:", err);
            setMembrosSorteados([]);
            setMembrosSelecionados({});
            toast({
                title: "Erro",
                description: "Falha ao gerar escala aleatória. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setCarregandoSorteio(false);
        }
    };

    const handleConfirmar = async () => {
        const selecionadosCount = Object.values(membrosSelecionados).filter(Boolean).length;

        if (selecionadosCount === 0) {
            toast({
                title: "Atenção",
                description: "Selecione ao menos um membro para confirmar a escala.",
                variant: "destructive"
            });
            return;
        }

        try {
            setCarregandoConfirmar(true);

            // Chamar serviço para atualizar a escala com os membros selecionados
            await atualizarEscalaMembroLider(idExternoEscalaEvento, membrosSelecionados);

            // Mostrar sucesso e chamar callback do pai para recarregar a lista
            toast({
                title: "Sucesso",
                description: "Escala atualizada com sucesso!",
                variant: "success"
            });

            onConfirm?.();
            onClose();
        } catch (err) {
            console.error("Erro ao atualizar escala:", err);
            toast({
                title: "Erro",
                description: "Falha ao atualizar escala. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setCarregandoConfirmar(false);
        }
    };

    const getButtonClass = (variant, disabled) => {
        const baseClass = "px-4 py-1 rounded-lg text-sm font-medium transition-colors";

        if (variant === "escalado") {
            return disabled
                ? `${baseClass} bg-success-500 text-white cursor-not-allowed`
                : `${baseClass} bg-success-500 text-white hover:opacity-90`;
        }
        
        if (disabled) {
            if (variant === "ocupado") {
                return `${baseClass} bg-icf-primary-200 text-white cursor-not-allowed`;
            }
        } else {
            return `${baseClass} bg-icf-primary-100 text-icf-primary-400 hover:bg-icf-primary-200`;
        }
        
        return baseClass;
    };

    return (
        <BaseModal
            title="Gerenciar Escala"
            onClose={onClose}
            size="md"
            footer={
                <Button
                    onClick={handleConfirmar}
                    disabled={carregandoConfirmar}
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {carregandoConfirmar ? "Atualizando..." : "Confirmar escala"}
                </Button>
            }
        >
            <div className="space-y-5">
                {/* Toggle Aleatório / Manual */}
                <div className="flex items-center h-10 bg-icf-primary-50 rounded-lg p-1">
                    <button 
                        onClick={() => {
                            setModo('aleatorio');
                            setMembrosSelecionados({});
                        }}
                        className={cn(
                            "flex-1 h-full rounded-md text-sm font-medium transition-colors",
                            modo === 'aleatorio' 
                                ? "bg-white text-icf-primary-400 shadow-sm" 
                                : "text-icf-primary-300 hover:text-icf-primary-400"
                        )}
                    >
                        Aleatório
                    </button>
                    <button 
                        onClick={() => {
                            setModo('manual');
                            setMembrosSorteados([]);
                            setMembrosSelecionados({});
                        }}
                        className={cn(
                            "flex-1 h-full rounded-md text-sm font-medium transition-colors",
                            modo === 'manual' 
                                ? "bg-white text-icf-primary-400 shadow-sm" 
                                : "text-icf-primary-300 hover:text-icf-primary-400"
                        )}
                    >
                        Escolher Manualmente
                    </button>
                </div>

                {/* Tamanho da equipe - Modo Aleatório */}
                {modo === 'aleatorio' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-icf-primary-400">Tamanho da equipe</label>
                        <div className="flex gap-3">
                            <Input 
                                type="number" 
                                value={tamanhoEquipe}
                                onChange={(e) => setTamanhoEquipe(Number(e.target.value))}
                                className="w-24 border-icf-primary-100"
                                min={1}
                            />
                            <Button
                                onClick={handleGerarEscalaAleatoria}
                                disabled={carregandoSorteio || carregandoConfirmar}
                                className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {carregandoSorteio ? "Gerando..." : "Gerar escala aleatória"}
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[250px] overflow-y-auto">
                            {membrosSorteados.length > 0 ? (
                                membrosSorteados.map((membro) => (
                                    <div
                                        key={membro.idExternoMembroMinisterio || membro.membroMinisterioId}
                                        className="flex items-center justify-between p-3 border border-icf-primary-100 rounded-lg bg-icf-primary-50"
                                    >
                                        <span className="text-sm font-medium text-icf-primary-400">
                                            {membro.nomeMembro}
                                        </span>
                                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-success-500 text-white">
                                            Sorteado
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-sm text-icf-primary-200">
                                    Gere uma escala aleatória para visualizar os membros sorteados.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lista de membros - Modo Manual */}
                {modo === 'manual' && (
                    <div className="space-y-3">
                        {/* Busca */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icf-primary-200" />
                            <Input
                                type="text"
                                placeholder="Buscar"
                                value={buscaTexto}
                                onChange={(e) => setBuscaTexto(e.target.value)}
                                className="pl-10 bg-white border-icf-primary-100 focus:border-icf-primary-300 h-10"
                            />
                        </div>

                        {/* Lista de membros */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {carregando ? (
                                <div className="text-center py-8 text-icf-primary-200">
                                    Carregando membros...
                                </div>
                            ) : membrosFiltrados.length === 0 ? (
                                <div className="text-center py-8 text-icf-primary-200">
                                    {buscaTexto ? "Nenhum membro encontrado" : "Nenhum membro disponível"}
                                </div>
                            ) : (
                                membrosFiltrados.map((membro) => {
                                    const statusInfo = getStatusBotao(membro);
                                    const botaoDesabilitado = statusInfo.disabled || carregandoConfirmar;
                                    return (
                                        <div
                                            key={membro.membroMinisterioId}
                                            className="flex items-center justify-between p-3 border border-icf-primary-100 rounded-lg hover:bg-icf-primary-50 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-icf-primary-400">
                                                {membro.nomeMembro}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    if (!botaoDesabilitado) {
                                                        toggleMembroSelecionado(membro.membroMinisterioId);
                                                    }
                                                }}
                                                disabled={botaoDesabilitado}
                                                className={getButtonClass(statusInfo.variant, botaoDesabilitado)}
                                            >
                                                {statusInfo.label}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
}
