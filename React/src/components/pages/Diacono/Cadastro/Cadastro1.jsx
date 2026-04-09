import { useNavigate } from "react-router-dom";
import { BotaoDiacono } from "../../../atoms/Diacono/BotaoDiacono";
import { TelaAzulDiacono } from "../../../templates/Diacono/TelaAzulDiacono";
import { useEffect } from "react";
import { useState } from "react";
import api from '../../../../provider/api'
import { useCadastro } from "../../../../context/CadastroContext";
import { BotaoGoogle } from "../../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../../atoms/Global/LinkAcesso";
import Select from "react-select";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../../../services/login";
import { useAuth } from "../../../../routes/AuthContext.jsx";

export function Cadastro1() {
    const [listaIgrejas, setListaIgrejas] = useState([]);
    const [erroIgreja, setErroIgreja] = useState(false);
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const opcoesIgrejas = listaIgrejas.map((igreja) => ({
        value: igreja.idExterno,
        label: igreja.nome,
    }));

    const igrejaSelecionada = opcoesIgrejas.find(
        (opt) => opt.value === dadosCadastro.fkIgreja
    );

    const handleIgrejaChange = (selected) => {
        handleChange({
            target: {
                name: "fkIgreja",
                value: selected ? selected.value : "",
            },
        });
    };



    const handleAvancar = () => {
        const camposObrigatorios = ["fkIgreja"];
        const camposVazios = camposObrigatorios.filter(campo => !dadosCadastro[campo]);

        if (camposVazios.length > 0) {
            setErroIgreja(true);
            return;
        }

        setErroIgreja(false);
        navigate("/cadastro/etapa2");
    };

    useEffect(() => {
        api.get('/register')
            .then(response => setListaIgrejas(response.data))
            .catch(() => console.log('Erro ao listar igrejas'))
        console.log("Igrejas carregadas:", listaIgrejas);
    }, [])

    const handleChange = (e) => {
        setDadosCadastro({ ...dadosCadastro, fkIgreja: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        try {
            const { user } = await loginWithGoogle(idToken);
            setUser(user);
            navigate("/cadastro/etapa2");
        } catch (e) {
            console.error("erro no login Google", e);
        }
    };

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const loginGoogle = googleClientId
        ? useGoogleLogin({
            onSuccess: handleGoogleSuccess,
            onError: (err) => console.error("Google login falhou", err),
            onNonOAuthError: (nonOAuth) => console.error("Google non-OAuth error", nonOAuth),
        })
        : null;

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[55%] flex flex-col gap-5">
                    <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
                    <label className="text-diacono-blue-400">Qual a sua igreja?</label>
                    <div className="flex flex-col gap-1">
                        <Select
                            className={`text-diacono-blue-400 rounded-lg text-[14px]`}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    alignItems: "flex-start",
                                    height: "40px",
                                    padding: "4px",
                                    borderColor: erroIgreja 
                                        ? "#ef4444"
                                        : state.isFocused
                                        ? "#93C5FD"
                                        : "#BFCDE0",
                                    borderWidth: "1.5px",
                                    boxShadow: erroIgreja 
                                        ? "0 0 0 1px #ef4444"
                                        : state.isFocused ? "0 0 0 1px #93C5FD" : "none",
                                    "&:hover": {
                                        borderColor: erroIgreja ? "#ef4444" : "#93C5FD",
                                    },
                                }),
                            }}
                            options={opcoesIgrejas}
                            value={igrejaSelecionada}
                            onChange={(selected) => {
                                handleIgrejaChange(selected);
                                setErroIgreja(false);
                            }}
                            placeholder="Selecione uma igreja"
                            isClearable
                        />
                        {erroIgreja && (
                            <span className="text-red-500 text-[12px] font-medium">
                                Selecione uma opção
                            </span>
                        )}
                    </div>

                    <BotaoDiacono onClick={handleAvancar}>Próximo</BotaoDiacono>
                    <div className='flex flex-col gap-3 items-end'>
                        <BotaoGoogle onClick={() => loginGoogle && loginGoogle()}>Entrar com o Google</BotaoGoogle>
                        <LinkAcesso onClick={() => navigate('/login')} label={"Já tem uma conta?"} link={"Acessar"} />
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center bg-[url('/telaAzulLogin.svg')] bg-cover bg-center">
                <TelaAzulDiacono />
            </div>
        </div>

    );
}