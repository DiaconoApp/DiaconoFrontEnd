import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";

export function ModalExclusao({ titulo, pergunta, onConfirm, onCancel }) {
    return (
        <BaseModal
            title={titulo}
            onClose={onCancel}
            size="sm"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Não
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Sim, excluir
                    </Button>
                </>
            }
        >
            <p className="text-icf-primary-300 text-center">{pergunta}</p>
        </BaseModal>
    );
}