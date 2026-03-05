import { Repeat } from "lucide-react";
import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";

export function ModalRecorrente({ formData, setFormData, onClose }) {

    const handleDiscard = () => {
        setFormData(prev => ({
            ...prev,
            recorrencia: {
                tipoRecorrencia: "NAO_REPETE",
                dataInicioRecorrencia: prev.dataInicio,   // mesmo padrão do FormEventos
                dataTerminoRecorrencia: prev.dataInicio
            }
        }));
        onClose();
    };

    return (
        <BaseModal
            title="Repetir"
            onClose={onClose}
            size="md"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={onClose}
                        className="flex-1 bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
                    >
                        Salvar
                    </Button>
                    <Button
                        onClick={handleDiscard}
                        variant="outline"
                        className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Descartar
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-icf-primary-400">Repetir até:</label>
                    <input 
                        type="date" 
                        value={formData.recorrencia.dataTerminoRecorrencia}
                        onChange={e =>
                            setFormData(prev => ({
                                ...prev,
                                recorrencia: {
                                    ...prev.recorrencia,
                                    dataTerminoRecorrencia: e.target.value
                                }
                            }))
                        }
                        className="border-b-2 border-b-icf-primary-100 text-icf-primary-400 focus:outline-none focus:border-b-icf-primary-200 py-1"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Repeat className="w-5 h-5 text-icf-primary-400" />
                        <label className="text-sm text-icf-primary-300">Repetir a cada</label>
                    </div>
                    <select 
                        value={formData.recorrencia.tipoRecorrencia}
                        onChange={e =>
                            setFormData(prev => ({
                                ...prev,
                                recorrencia: {
                                    ...prev.recorrencia,
                                    tipoRecorrencia: e.target.value
                                }
                            }))
                        }
                        className="text-icf-primary-400 rounded-md px-3 py-2 bg-icf-primary-50 border border-icf-primary-100 focus:outline-none focus:ring-2 focus:ring-icf-primary-200"
                    >
                        <option value='NAO_REPETE' disabled>Selecione...</option>
                        <option value="SEMANAL">Semana</option>
                        <option value="MENSAL">Mês</option>
                    </select>
                </div>
            </div>
        </BaseModal>
    );
}