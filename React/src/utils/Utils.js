//Utils CEP
export const validationCEP = async (cep) => {

    try {

        cep = cep.trim().replace(/\D/g, '');

        if (!(/^\d{8}$/).test(cep)) throw { cep_error: 'Formato Inválido' };

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        const data = await response.json();

        if (data.erro) {

            throw { cep_error: 'CEP não encontrado' };

        }
        console.log(data);
        return data;

    } catch (e) {
        console.log(e.cep_error || e);
        return null;
    }

}


//Utils Nome
export const transformationName = (string) => {
    if (!string || string.trim() === "") {
        return "";
    }

    const arrayNames = string
        .trim()
        .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, "")
        .split(/\s+/);

    const arrayNamesFinal = arrayNames.map(
        item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    );

    const resultado = arrayNamesFinal.join(" ");

    return resultado;
};

//Utils Senha
export const validatePassword = (senha) => {
    if (!senha || senha.length < 8) {
        return "A senha deve ter pelo menos 8 caracteres.";
    }

    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(senha);

    if (!hasUpperCase) return "A senha deve conter pelo menos uma letra maiúscula.";
    if (!hasLowerCase) return "A senha deve conter pelo menos uma letra minúscula.";
    if (!hasNumber) return "A senha deve conter pelo menos um número.";
    if (!hasSpecialChar) return "A senha deve conter pelo menos um caractere especial.";

    return "Senha válida!";
};

//Utils Double
export const transformationDouble = (double) => {

    if (isNaN(Number(double))) {

        console.log(`${double} não é um número`);
        return `${double} não é um número`;
    }

    if (Number.isInteger(double)) {
        console.log(`${double} é um inteiro`);
        return `${double} é um inteiro`;
    }

    console.log(double.toString().replace(".", ","));

    return double.toString().replace(".", ",");

}


// transformationDouble(10.3);

//Utils CNPJ
export const validationCNPJ = async (cnpj) => {
    try {
        cnpj = cnpj.trim().replace(/\D/g, '');

        if (!(/^\d{14}$/).test(cnpj))
            throw { cnpj_error: 'CNPJ inválido' };

        const resp = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);

        if (!resp.ok)
            throw { cnpj_error: `Erro HTTP ${resp.status} no ReceitAWS` };

        const json = await resp.json();

        console.log('Dados via ReceitAWS:', json);
        return json;

    } catch (e) {

        console.log('ReceitAWS erro:', e.cnpj_error || e);
        return null;
    }
};


// validationCNPJ('47960950000121')
// .then((resultado) => console.log(resultado))
// .catch((err) => console.log(err));


//Utils CPF
export function validaCpf(cpf) {
    if (!isCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');
    var cpfBase = cpfLimpo.slice(0, 9);

    const calcularDigito = () => {
        var arrayNumeros = Array.from(cpfBase).map(numero => parseInt(numero));

        var cpfMultiplicado = arrayNumeros.map((numero, index) => {
            if (arrayNumeros.length == 9) return numero * (index + 1);

            return numero * index;
        });

        var somaCpf = cpfMultiplicado.reduce((acc, num) => acc + num, 0);

        var digitoVerificador = somaCpf % 11;
        if (digitoVerificador == 10) digitoVerificador = 0;

        return digitoVerificador;
    }

    const digitoVerificador1 = calcularDigito();
    cpfBase += digitoVerificador1.toString();

    const digitoVerificador2 = calcularDigito();
    cpfBase += digitoVerificador2.toString();

    return cpfBase === cpfLimpo;
}

export function isCpf(cpf) {
    if (!cpf) return false;

    const regexCpf = /^(\d{11}|\d{3}\.\d{3}\.\d{3}\-\d{2})$/;
    return regexCpf.test(cpf);
}

export function formatarCpf(cpf) {
    if (!validaCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');

    if (cpf !== cpfLimpo) return cpfLimpo;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

//Utils telefone 
export function formatarTelefone(telefone) {
    if (!isTelefone(telefone)) return false;

    var telefoneLimpo = telefone.replace(/[^\d]+/g, '');

    if (telefone !== telefoneLimpo) return telefoneLimpo;

    switch (telefoneLimpo.length) {
        case 13:
            return telefoneLimpo.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        case 11:
            return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        case 9:
            return telefoneLimpo.replace(/(d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
}

export function isTelefone(telefone) {
    if (!telefone) return false;

    const regexTelefone = /^([+]?\d{2}?\s)?(\(?\d{2}\)?\s)?(\d{5,9})([-\s])?(\d{4})$/;
    return regexTelefone.test(telefone);
}

export const safeFormatDate = (dateStr) => {
    if (!dateStr) return "";            // evita erro quando for null/undefined
    const ymd = dateStr.split("T")[0]; // remove time se vier ISO
    return ymd.split("-").reverse().join("/");
};

export const formatarDataHora = (dataHora) => {
    if (!dataHora) return "";
    const date = new Date(dataHora);
    return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


export function validaEmail(email) {
    if (!email) return false;

    const emailLimpo = email.trim().toLowerCase();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailLimpo);
}

export const formatarCargo = (cargo) => {
    if (!cargo) return "";

    switch (cargo.toUpperCase()) {
        case "LIDER_MINISTERIO":
            return "Líder";
        case "MEMBRO_MINISTERIO":
            return "Membro";
        case "MEMBRO":
            return "Membro";
        case "GOVERNO":
            return "Governo";
        default:
            return cargo;
    }
};

export const formatarData = (data) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
};

export const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
};

