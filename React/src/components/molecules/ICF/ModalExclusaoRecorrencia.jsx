import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";

export function ModalExclusaoRecorrencia({
    onClose,
    onConfirm,
    opcaoRecorrencia,
    setOpcaoRecorrencia
}) {
    return (
        <BaseModal
            title="Confirmar Exclusão"
            onClose={onClose}
            size="md"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                        Excluir
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-icf-primary-300">
                    Tem certeza que deseja excluir o evento? <span className="font-medium">"Culto de oração"</span>?
                </p>
                
                <div className="space-y-3">
                    <span className="text-sm font-medium text-icf-primary-400">Escolha uma opção</span>
                    <div className="space-y-2">
                        <label className="flex items-center border rounded-lg p-4 gap-3 cursor-pointer border-icf-primary-100 bg-white hover:bg-icf-primary-50 transition-colors">
                            <input 
                                type="radio" 
                                name="excluirRecorrencia" 
                                checked={opcaoRecorrencia === "unico"} 
                                onChange={() => setOpcaoRecorrencia("unico")} 
                                className="w-4 h-4 text-icf-primary-400 border-icf-primary-200 focus:ring-icf-primary-400" 
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-icf-primary-400">Excluir apenas este evento</span>
                                <span className="text-xs text-icf-primary-200">Remove somente esta ocorrência</span>
                            </div>
                        </label>
                        <label className="flex items-center border rounded-lg p-4 gap-3 cursor-pointer border-icf-primary-100 bg-white hover:bg-icf-primary-50 transition-colors">
                            <input 
                                type="radio" 
                                name="excluirRecorrencia" 
                                checked={opcaoRecorrencia === "multiplos"} 
                                onChange={() => setOpcaoRecorrencia("multiplos")} 
                                className="w-4 h-4 text-icf-primary-400 border-icf-primary-200 focus:ring-icf-primary-400" 
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-icf-primary-400">Excluir este e todas as recorrências</span>
                                <span className="text-xs text-icf-primary-200">Remove este evento e todos os futuros</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}