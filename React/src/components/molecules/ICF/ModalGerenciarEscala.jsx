import React, { useState } from 'react';
import { BaseModal } from '../../atoms/ICF/BaseModal';
import { Button } from '@/components/ui/button';
import { OpcaoSelecionar } from '../../atoms/ICF/OpcaoSelecionar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function ModalGerenciarEscala({ onClose, onConfirm }) {
    const [modo, setModo] = useState('aleatorio'); // 'aleatorio' | 'manual'
    const [tamanhoEquipe, setTamanhoEquipe] = useState(3);

    return (
        <BaseModal
            title="Gerenciar Escala"
            onClose={onClose}
            size="md"
            footer={
                <Button
                    onClick={onConfirm}
                    className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white w-full"
                >
                    Confirmar escala
                </Button>
            }
        >
            <div className="space-y-5">
                {/* Toggle Aleatório / Manual */}
                <div className="flex items-center h-10 bg-icf-primary-50 rounded-lg p-1">
                    <button 
                        onClick={() => setModo('aleatorio')}
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
                        onClick={() => setModo('manual')}
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

                {/* Tamanho da equipe */}
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
                            <Button className="bg-icf-primary-400 hover:bg-icf-primary-500 text-white">
                                Gerar escala aleatória
                            </Button>
                        </div>
                    </div>
                )}

                {/* Lista de membros */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-icf-primary-400">Membros da escala</label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        <OpcaoSelecionar nome="João Silva" tituloBotao="Trocar" />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}
