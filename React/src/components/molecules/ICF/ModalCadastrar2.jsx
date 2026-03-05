import { BaseModal } from "../../atoms/ICF/BaseModal";
import { Button } from "@/components/ui/button";
import { InputIcf } from "../../atoms/ICF/InputIcf";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { SelectIcf } from "../../atoms/ICF/SelectIcf";
import { useEffect, useState } from "react";
import { buscarMinisterios } from "../../../services/ministerios";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import { useCadastro } from "../../../context/CadastroContext";

export function ModalCadastrar2({ onClose, onBack, onSubmit }) {

    const { dadosCadastro, setDadosCadastro } = useCadastro();

    const cargos = [
        { idExterno: "MEMBRO", nome: "Membro" },
    ];

    const [options, setOptions] = useState([]);
    useEffect(() => {
        buscarMinisterios().then(setOptions);
    }, []);

    
    
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
        onSubmit(dadosCadastro);
    };
    
    return (
        <BaseModal
            title="Cadastrar Novo Membro"
            onClose={onClose}
            size="lg"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        Voltar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-icf-primary-400 hover:bg-icf-primary-500 text-white"
                    >
                        Cadastrar Membro
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <EtapasCadastro corLinha="border-[#D9D9D9]" corTexto="text-icf-primary-400" className1="bg-icf-primary-100 text-icf-primary-300" className2="bg-icf-primary-200 text-icf-primary-300" />
                <div className="flex gap-4">
                    <SelectIcf
                        placeholder="Nenhum"
                        label="Ministério"
                        options={options}
                        value={dadosCadastro.ministerios}
                        onChange={(valor) => handleChange("ministerios", valor)}
                    />

                    <SelectIcf
                        label="Cargo"
                        options={cargos}
                        value={dadosCadastro.cargo}
                        onChange={(valor) => handleChange("cargo", valor)}
                    />
                </div>
                <div className="flex gap-4">
                    <InputIcf
                        label="CEP"
                        value={dadosCadastro.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                    />
                    <InputIcf
                        label="Rua/Avenida"
                        value={dadosCadastro.rua}
                        onChange={(e) => handleChange("rua", e.target.value)}
                        disabled={!!dadosCadastro.rua}
                    />
                </div>
                <div className="flex gap-4">
                    <InputIcf
                        label="Bairro"
                        value={dadosCadastro.bairro}
                        onChange={(e) => handleChange("bairro", e.target.value)}
                        disabled={!!dadosCadastro.bairro} />
                    <InputIcf
                        label="Cidade"
                        value={dadosCadastro.cidade}
                        onChange={(e) => handleChange("cidade", e.target.value)}
                        disabled={!!dadosCadastro.cidade} />
                </div>
                <div className="flex gap-4">
                    <InputIcf
                        label="Número"
                        value={dadosCadastro.numero}
                        onChange={(e) => handleChange("numero", e.target.value)} />
                    <InputIcf
                        label="Complemento"
                        value={dadosCadastro.complemento}
                        onChange={(e) => handleChange("complemento", e.target.value)} />
                </div>
            </div>
        </BaseModal>
    )
}