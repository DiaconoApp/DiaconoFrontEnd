import { useState, useEffect } from "react";
import { BotaoIcf } from "../../atoms/ICF/BotaoIcf";
import { TituloModal } from "../../atoms/ICF/TituloModal";
import axios from "axios";
import { EnderecosSalvos } from "../../atoms/ICF/EnderecosSalvos";

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
        <div className="bg-white shadow-menu-shadow flex flex-col justify-start items-center rounded w-130 p-5">
            <div className="w-[90%] flex flex-col gap-4">
                <TituloModal titulo={"Endereços Salvos"} onClose={onClose} />
                <div className="border border-icf-primary-50"></div>

                <div className="flex flex-col gap-2 overflow-y-auto">
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

                <div className="w-full flex justify-between gap-25">
                    <BotaoIcf
                        className="bg-icf-primary-400 flex items-center justify-center gap-2"
                        onClick={handleNovo}
                    >
                        <span className="text-xl mb-1">+</span> Novo Endereço
                    </BotaoIcf>

                    <BotaoIcf className="bg-icf-primary-200" onClick={onClose}>
                        Fechar
                    </BotaoIcf>
                </div>
            </div>
        </div>
    );
}
