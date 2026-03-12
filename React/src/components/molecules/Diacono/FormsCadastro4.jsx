import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { CadastroLayout } from "../../templates/Diacono/CadastroLayout";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { AlertModal } from "../../ui/AlertModal";
import { useState } from "react";

export function FormsCadastro4() {
    const navigate = useNavigate();
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const [modal, setModal] = useState(null);

    const handleChange = (campo, valor) => {
        setDadosCadastro((prev) => ({ ...prev, [campo]: valor }));
    };

    const { buscarEnderecoPorCep } = useValidacaoCadastro();
    const handleCepChange = async (cep) => {
        handleChange("cep", cep); 
        if (cep.length === 8) {
            const endereco = await buscarEnderecoPorCep(cep);
            if (endereco) {
                handleChange("rua", endereco.rua);
                handleChange("bairro", endereco.bairro);
                handleChange("cidade", endereco.cidade);
                handleChange("estado", endereco.uf);
            }
        }
    };

     const handleSubmit = () => {
        const camposObrigatorios = ["cep", "rua", "bairro", "cidade", "numero"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]); 
    }

    const handleAvancar = () => {
        const camposObrigatorios = ["cep", "rua", "bairro", "cidade", "numero"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0) {
            setModal({
                type: "warning",
                title: "Campos obrigatórios",
                message: "Preencha todos os campos corretamente para continuar."
            });
            return;
        }

        navigate("/cadastro/etapa4");
    };

    return (
        <CadastroLayout
            etapaAtual={3}
            onVoltar={() => navigate('/cadastro/etapa3')}
            onProximo={handleSubmit}
            textoBotaoProximo="Finalizar cadastro"
        >
            <label className="font-semibold text-diacono-blue-400">Endereço</label>
            <div className="grid grid-cols-2 gap-6">
                <InputDiacono
                    label="CEP *"
                    placeholder="Digite seu CEP"
                    value={dadosCadastro.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                />
                <InputDiacono
                    label="Rua/Avenida *"
                    placeholder="Ex: Rua Japão"
                    value={dadosCadastro.rua}
                    onChange={(e) => handleChange("rua", e.target.value)}
                    disabled={!!dadosCadastro.rua}
                />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <InputDiacono
                    label="Bairro *"
                    placeholder="Digite seu bairro"
                    value={dadosCadastro.bairro}
                    onChange={(e) => handleChange("bairro", e.target.value)}
                    disabled={!!dadosCadastro.bairro} />
                <InputDiacono
                    label="Cidade *"
                    placeholder="Digite sua cidade"
                    value={dadosCadastro.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                    disabled={!!dadosCadastro.cidade} />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <InputDiacono
                    label="Número *"
                    placeholder="Digite o número"
                    value={dadosCadastro.numero}
                    onChange={(e) => handleChange("numero", e.target.value)} />
                <InputDiacono
                    label="Complemento"
                    placeholder="Digite o complemento"
                    value={dadosCadastro.complemento}
                    onChange={(e) => handleChange("complemento", e.target.value)} />
            </div>
            {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
        </CadastroLayout>
    );
}