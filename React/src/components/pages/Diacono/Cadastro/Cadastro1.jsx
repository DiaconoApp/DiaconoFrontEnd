import { useNavigate } from "react-router-dom";
import { BotaoDiacono } from "../../../atoms/Diacono/BotaoDiacono";
import { TelaAzulDiacono } from "../../../templates/Diacono/TelaAzulDiacono";
import { useEffect } from "react";
import { useState } from "react";
import api from '../../../../provider/api'
import { useCadastro } from "../../../../context/CadastroContext";
import { BotaoGoogle } from "../../../atoms/Global/BotaoGoogle";
import { LinkAcesso } from "../../../atoms/Global/LinkAcesso";

export function Cadastro1() {
    const [listaIgrejas, setListaIgrejas] = useState([]);
    const { dadosCadastro, setDadosCadastro } = useCadastro();
    const navigate = useNavigate();

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
            .then(response => setListaIgrejas(response.data))
            .catch(() => console.log('Erro ao listar igrejas'))
        console.log("Igrejas carregadas:", listaIgrejas);
    }, [])

    const handleChange = (e) => {
        setDadosCadastro({ ...dadosCadastro, fkIgreja: e.target.value });
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-[55%] flex flex-col gap-5">
                    <span className="font-bold text-[28px] text-diacono-blue-400">Criar uma conta</span>
                    <label className="text-diacono-blue-400">Qual a sua igreja?</label>
                    <select value={dadosCadastro.fkIgreja} onChange={handleChange} className="text-diacono-blue-400 border border-diacono-blue-100 rounded-lg h-10 p-2 focus:outline-none focus:border-diacono-blue-200 focus:border-3 text-[14px]">
                        <option value="" disabled>Selecione uma igreja</option>
                        {listaIgrejas.map(igreja => (
                            <option key={igreja.idExterno} value={igreja.idExterno}>{igreja.nome}</option>
                        ))}
                    </select>
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