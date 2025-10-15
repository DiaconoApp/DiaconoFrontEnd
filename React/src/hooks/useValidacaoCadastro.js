import {
    transformationName,
    validaCpf,
    validationCEP,
} from "../utils/Utils";

export function useValidacaoCadastro() {
    const validarNome = (nome) => {
        return transformationName(nome);
    };

    const validarCpf = (cpf) => {
        return validaCpf(cpf);
    };

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

    const senhasConferem = (senha, confirmarSenha) => {
        return senha === confirmarSenha;
    };

    return {
        validarNome,
        validarCpf,
        buscarEnderecoPorCep,
        senhasConferem,
    };
}