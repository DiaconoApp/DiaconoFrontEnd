import { useState, useEffect } from "react";
import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnderecosSalvos } from "../../atoms/ICF/EnderecosSalvos";
import { Plus } from "lucide-react";

export function ModalLocal2({ onSelect, onClose, onOpenLocal1 }) {
    const [locais, setLocais] = useState([]);

    // Carregar locais do JSON server
    const carregarLocais = () => {
        axios.get("http://localhost:3000/locais")
            .then(res => setLocais(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { carregarLocais(); }, []);

    // Excluir local
    const handleDelete = (id) => {
        if (!window.confirm("Deseja realmente excluir este local?")) return;
        axios.delete(`http://localhost:3000/locais/${id}`)
            .then(() => carregarLocais())
            .catch(err => console.error(err));
    };

    const handleEditar = (local) => {
        onClose(); // fecha modal 2
        onOpenLocal1(local); // abre modal 1 com dados
    };

    const handleNovo = () => {
        onClose();
        onOpenLocal1(null); // abre modal 1 vazio (novo)
    };


    return (
        <BaseModal
            title="Endereços Salvos"
            onClose={onClose}
            size="md"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={handleNovo}
                        className="flex-1 bg-icf-primary-400 hover:bg-icf-primary-500 text-white gap-2"
                    >
                        <Plus className="w-4 h-4" /> Novo Endereço
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Fechar
                    </Button>
                </div>
            }
        >
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {locais.map(local => (
                    <EnderecosSalvos
                        key={local.id}
                        titulo={local.apelido}
                        endereco={`${local.rua}, ${local.numero} - ${local.bairro}, ${local.cidade}`}
                        onClick={() => { onSelect(local); onClose(); }}
                        onEdit={() => handleEditar(local)}
                        onDelete={() => handleDelete(local.id)}
                    />
                ))}
            </div>
        </BaseModal>
    );
}
