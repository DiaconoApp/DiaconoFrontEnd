import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../atoms/ICF/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { buscarMinisteriosEvento, atualizarMinisteriosEvento } from '../../../services/escalas';

export function ModalEscalarMinisterios({ eventoId, onClose, onConfirm }) {
    const [buscaTexto, setBuscaTexto] = useState("");
    const [ministerios, setMinisterios] = useState([]);
    const [ministeriosFiltrados, setMinisteriosFiltrados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    // Carregar ministérios do evento
    useEffect(() => {
        console.log("useEffect do ModalEscalarMinisterios executado, eventoId:", eventoId);
        const carregarMinisterios = async () => {
            try {
                setCarregando(true);
                console.log("Chamando buscarMinisteriosEvento com eventoId:", eventoId);
                const dados = await buscarMinisteriosEvento(eventoId);
                console.log("Dados recebidos:", dados);
                const lista = Array.isArray(dados) ? dados : [];
                setMinisterios(lista);
                setMinisteriosFiltrados(lista);
            } catch (err) {
                console.error("Erro ao carregar ministérios:", err);
                setMinisterios([]);
                setMinisteriosFiltrados([]);
            } finally {
                setCarregando(false);
            }
        };

        if (eventoId) {
            carregarMinisterios();
        } else {
            console.log("eventoId não definido, não carregando");
        }
    }, [eventoId]);

    // Filtrar ministérios baseado na busca
    useEffect(() => {
        const filtrados = ministerios.filter(m =>
            m.nomeMinisterio?.toLowerCase().includes(buscaTexto.toLowerCase())
        );
        setMinisteriosFiltrados(filtrados);
    }, [buscaTexto, ministerios]);

    // Alternar status de escalado
    const toggleMinisterio = (idMinisterio) => {
        setMinisterios(prev =>
            prev.map(m =>
                m.idExternoMinisterio === idMinisterio
                    ? { ...m, isMinisterioEscalado: !m.isMinisterioEscalado }
                    : m
            )
        );
    };

    // Confirmar e salvar mudanças
    const handleConfirm = async () => {
        try {
            setSalvando(true);
            await atualizarMinisteriosEvento(eventoId, ministerios);
            onConfirm?.();
            onClose();
        } catch (err) {
            console.error("Erro ao atualizar ministérios:", err);
            alert("Erro ao atualizar ministérios. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <BaseModal
            title="Gerenciar Ministérios"
            onClose={onClose}
            size="md"
            footer={
                <Button
                    onClick={handleConfirm}
                    disabled={salvando}
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white w-full disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Confirmar escala"}
                </Button>
            }
        >
            <div className="space-y-4">
                {/* Texto explicativo */}
                <p className="text-sm text-icf-primary-300">
                    Selecione os ministérios que estarão escalados neste evento.
                </p>

                {/* Busca */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icf-primary-200" />
                    <Input
                        type="text"
                        placeholder="Buscar ministério..."
                        value={buscaTexto}
                        onChange={(e) => setBuscaTexto(e.target.value)}
                        className="pl-10 bg-white border-icf-primary-100 focus:border-icf-primary-300 h-10"
                    />
                </div>

                {/* Lista de ministérios */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {carregando ? (
                        <div className="text-center py-8 text-icf-primary-200">
                            Carregando ministérios...
                        </div>
                    ) : ministeriosFiltrados.length === 0 ? (
                        <div className="text-center py-8 text-icf-primary-200">
                            {buscaTexto ? "Nenhum ministério encontrado" : "Nenhum ministério disponível"}
                        </div>
                    ) : (
                        ministeriosFiltrados.map((ministerio) => (
                            <div
                                key={ministerio.idExternoMinisterio}
                                className="flex items-center justify-between p-3 border border-icf-primary-100 rounded-lg hover:bg-icf-primary-50 transition-colors"
                            >
                                <span className="text-sm font-medium text-icf-primary-400">
                                    {ministerio.nomeMinisterio}
                                </span>
                                <button
                                    onClick={() => toggleMinisterio(ministerio.idExternoMinisterio)}
                                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        ministerio.isMinisterioEscalado
                                            ? "bg-success-500 hover:bg-success-600 text-white"
                                            : "bg-icf-primary-200 hover:bg-icf-primary-300 text-white"
                                    }`}
                                >
                                    {ministerio.isMinisterioEscalado ? "Escalado" : "Escalar"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
