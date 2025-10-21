import { transformationName, validaCpf, validatePassword, validationCEP } from "../utils/Utils";

export function useValidacaoCadastro() {
    const validarNome = (nome) => transformationName(nome);

    const validarCpf = (cpf) => validaCpf(cpf);

    const buscarEnderecoPorCep = async (cep) => {
        const resultado = await validationCEP(cep);
        if (!resultado) return null;

        return {
            rua: resultado.logradouro || "",
            bairro: resultado.bairro || "",
            cidade: resultado.localidade || "",
            uf: resultado.uf || "",
        };
    };

    const validarSenha = (senha) => validatePassword(senha);

    const senhasConferem = (senha, confirmarSenha) => senha === confirmarSenha;

    const validarCamposObrigatorios = (dados) => {
        const erros = [];

        if (!dados.nome) erros.push("Nome é obrigatório");
        if (!dados.cpf) erros.push("CPF é obrigatório");
        if (!dados.email) erros.push("Email é obrigatório");
        if (!dados.senha) erros.push("Senha é obrigatória");
        if (dados.senha !== dados.confirmarSenha) erros.push("Senhas não coincidem");
        if (!dados.ministerios) erros.push("Ministério é obrigatório");
        if (!dados.cargo) erros.push("Cargo é obrigatório");
        if (!dados.cep || !dados.rua || !dados.bairro || !dados.cidade || !dados.numero) {
            erros.push("Endereço completo é obrigatório");
        }

        return erros;
    };


    return {
        validarNome,
        validarCpf,
        buscarEnderecoPorCep,
        senhasConferem,
        validarSenha,
        validarCamposObrigatorios,
    };
}