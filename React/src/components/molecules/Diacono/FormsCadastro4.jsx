import { InputDiacono } from "../../atoms/Diacono/InputDiacono";
import { EtapasCadastro } from "../Global/EtapasCadastro";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { BotaoGoogle } from "../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../atoms/Global/LinkAcesso";
import { useNavigate } from "react-router-dom";
import { useCadastro } from "../../../context/CadastroContext";
import { useValidacaoCadastro } from "../../../hooks/useValidacaoCadastro";
import api from "../../../provider/api";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../../services/login";
import { useAuth } from "../../../routes/AuthContext.jsx";

export function FormsCadastro4() {
    const navigate = useNavigate();
    const { dadosCadastro, setDadosCadastro } = useCadastro();

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

    const { setUser } = useAuth();

    const handleSubmit = () => {
        const camposObrigatorios = ["cep", "rua", "bairro", "cidade", "numero"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0) {
            alert("Preencha todos os campos corretamente para continuar.");
            return;
        }

        api.post("/register", dadosCadastro)
            .then(() => {
                alert("Cadastro concluído com sucesso!");
                navigate("/login");
            })
            .catch(() => {
                alert("Erro ao finalizar cadastro.");
            });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            const { user } = await loginWithGoogle(idToken);
            setUser(user);
            navigate("/login");
        } catch (e) {
            console.error("erro google cadastro4", e);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (err) => console.error("Google login falhou", err),
        onNonOAuthError: (nonOAuth) => console.error("Google non-OAuth error", nonOAuth),
    });

    return (
        <div className="w-[55%] flex flex-col gap-5">
            <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
            <EtapasCadastro corLinha="border-diacono-blue-100" corTexto="text-diacono-blue-200" className1="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className2="bg-diacono-blue-50 border border-diacono-blue-100 text-diacono-blue-200" className3="bg-diacono-blue-400 text-white" />
            <div className="flex flex-col gap-5">
                <label className="font-semibold text-diacono-blue-400">Endereço</label>
                <div className="flex justify-between">
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
                <div className="flex justify-between">
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
                <div className="flex justify-between">
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
                <div className='flex flex-col gap-3 items-end'>
                    <div className="w-full flex justify-between gap-10">
                        <div className="w-[30%]">
                            <BotaoDiacono onClick={() => navigate('/cadastro/etapa3')}>Voltar</BotaoDiacono>
                        </div>
                        <div className="w-[50%]">
                            <BotaoDiacono onClick={handleSubmit}>Finalizar cadastro</BotaoDiacono>
                        </div>
                    </div>
                    <BotaoGoogle onClick={() => loginGoogle()}>Entrar com o Google</BotaoGoogle>
                    <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
                </div>
            </div>
        </div>
    );
}