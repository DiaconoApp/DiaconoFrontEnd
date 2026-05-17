import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { removerMembroMinisterio } from "../../../services/ministerios";
import { AlertModal } from "../../ui/AlertModal";

export function LinhaMinisterioMembro({ idMembro, idMinisterio, nome, email, celular, dtNascimento, cargo, onRemovido }) {
    const [modal, setModal] = useState(null);
    
    const handleDelete = async () => {
        try {
            await removerMembroMinisterio({ idMembro, idMinisterio });
            setModal({
                type: "success",
                title: "Sucesso",
                message: `Membro ${nome} removido com sucesso!`,
                autoClose: 2000
            });
            setTimeout(() => {
                if (onRemovido) onRemovido();
            }, 2000);
        } catch (err) {
            setModal({
                type: "error",
                title: "Erro",
                message: "Erro ao remover membro"
            });
        }
    };

    return (
        <>
        <li className="grid grid-cols-5 bg-icf-primary-50 text-sm text-icf-primary-400 p-4 items-center">
            <span className="flex flex-wrap">{nome}</span>
            <span className="flex flex-wrap">{email}</span>
            <span className="flex flex-wrap">{celular}</span>
            <span className="flex flex-wrap">{dtNascimento}</span>
            <div className="flex items-center justify-between">
                <span className="flex flex-wrap">{cargo}</span>
                <MdDeleteOutline
                    className="text-icf-primary-200 hover:text-icf-primary-300 cursor-pointer"
                    size={22}
                    onClick={handleDelete}
                />
            </div>
        </li>
        {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </>
    );
}