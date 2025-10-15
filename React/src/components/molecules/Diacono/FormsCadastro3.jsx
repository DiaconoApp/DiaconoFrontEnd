import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import api from "../../../provider/api";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";

export function FormsCadastro3() {
    const navigate = useNavigate();
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const { buscarEnderecoPorCep } = useValidacaoCadastro();

    const handleChange = (campo) => (e) => {
        setDadosCadastro({ ...dadosCadastro, [campo]: e.target.value });
    };

    const handleCepBlur = async () => {
        const endereco = await buscarEnderecoPorCep(dadosCadastro.cep);
        if (endereco) {
            setDadosCadastro({ ...dadosCadastro, ...endereco });
        }
    };

    const handleSubmit = () => {
        const camposObrigatorios = ["cep", "rua", "bairro", "cidade", "numero"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0) {
            alert("Preencha todos os campos de endereço antes de finalizar.");
            return;
        }

        api.post("/usuarios", dadosCadastro)
            .then(() => {
                alert("Cadastro concluído com sucesso!");
                navigate("/login");
            })
            .catch(() => {
                alert("Erro ao finalizar cadastro.");
            });
    };

    return (
        <div className="w-[55%] flex flex-col gap-5">
            <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
            <EtapasCadastro corLinha="border-diacono-blue-100" corTexto="text-diacono-blue-200" className1="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className2="bg-diacono-blue-400 text-white" />
            <div className="flex flex-col gap-5">
                <label className="font-semibold text-diacono-blue-400">Endereço</label>
                <div className="flex justify-between">
                    <InputDiacono
                        value={dadosCadastro.cep}
                        onChange={handleChange("cep")}
                        onBlur={handleCepBlur}
                        label="CEP"
                        placeholder="Digite seu CEP" />
                    <InputDiacono
                        value={dadosCadastro.rua}
                        onChange={handleChange("rua")}
                        label="Rua/Avenida"
                        placeholder="Ex: Rua Japão"
                        disabled={!!dadosCadastro.rua} />
                </div>
                <div className="flex justify-between">
                    <InputDiacono
                        value={dadosCadastro.bairro}
                        onChange={handleChange("bairro")}
                        label="Bairro"
                        placeholder="Digite seu bairro" 
                        disabled={!!dadosCadastro.bairro}/>
                    <InputDiacono
                        value={dadosCadastro.cidade}
                        onChange={handleChange("cidade")}
                        label="Cidade"
                        placeholder="Digite sua cidade" 
                        disabled={!!dadosCadastro.cidade}/>
                </div>
                <div className="flex justify-between">
                    <InputDiacono
                        value={dadosCadastro.numero}
                        onChange={handleChange("numero")}
                        label="Número"
                        placeholder="Digite o número" />
                    <InputDiacono
                        value={dadosCadastro.complemento}
                        onChange={handleChange("complemento")}
                        label="Complemento"
                        placeholder="Digite o complemento" />
                </div>
                <div className='flex flex-col gap-3 items-end'>
                    <div className="w-full flex justify-between gap-10">
                        <div className="w-[30%]">
                            <BotaoDiacono onClick={() => navigate('/cadastro2')}>Voltar</BotaoDiacono>
                        </div>
                        <div className="w-[50%]">
                            <BotaoDiacono onClick={handleSubmit}>Finalizar cadastro</BotaoDiacono>
                        </div>
                    </div>
                    <BotaoGoogle>Entrar com o Google</BotaoGoogle>
                    <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
                </div>
            </div>
        </div>
    );
}