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

export function Cadastro1() {
    const [listaIgrejas, setListaIgrejas] = useState([]);
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const navigate = useNavigate();

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
            alert("Selecione uma igreja para continuar.");
            return;
        }

        navigate("/cadastro/etapa2");
    };

    useEffect(() => {
        api.get('/register')
            .then(response => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setListaIgrejas(data);
                } else {
                    console.error("Resposta inesperada:", data);
                    setListaIgrejas([]); // fallback seguro
                }
            })
            .catch(() => console.log('Erro ao listar igrejas'));
    }, []);

    const handleChange = (e) => {
        setDadosCadastro({ ...dadosCadastro, fkIgreja: e.target.value });
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[55%] flex flex-col gap-5">
                    <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
                    <label className="text-diacono-blue-400">Qual a sua igreja?</label>
                    <div className="flex flex-col gap-1">
                        <Select
                            className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg text-[14px]"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    height: "40px",
                                    padding: "4px",
                                    borderColor: state.isFocused
                                        ? "#93C5FD" // cor equivalente a diacono-blue-200
                                        : "#DBEAFE", // cor equivalente a diacono-blue-100
                                    boxShadow: state.isFocused ? "0 0 0 1px #93C5FD" : "none",
                                    "&:hover": {
                                        borderColor: "#93C5FD",
                                    },
                                }),
                            }}
                            options={opcoesIgrejas}
                            value={igrejaSelecionada}
                            onChange={handleIgrejaChange}
                            placeholder="Selecione uma igreja"
                            isClearable
                        />
                    </div>

                    <BotaoDiacono onClick={handleAvancar}>Próximo</BotaoDiacono>
                    <div className='flex flex-col gap-3 items-end'>
                        <BotaoGoogle>Entrar com o Google</BotaoGoogle>
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