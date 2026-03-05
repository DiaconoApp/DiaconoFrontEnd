import { ConfirmModal } from "../../atoms/ICF/BaseModal";

export function ModalExclusao({ titulo, pergunta, onConfirm, onCancel }) {
    return (
        <ConfirmModal
            title={titulo}
            message={pergunta}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Sim"
            cancelText="Não"
            variant="danger"
        />
    );
}