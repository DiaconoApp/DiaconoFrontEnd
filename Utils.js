//Utils CEP
const validationCEP = async (cep) => {

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
 
validationCEP('06435040')

//Utils Nome
const transformationName = (string) => {

    const arrayNames = string.trim().replace(/[^a-zA-Z0]/g, "").split(/\s+/);

    if (arrayNames.length <= 0) {
        return "Erro: string vazia";
    }

    const arrayNamesFinal = arrayNames.map(item =>
        item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    );

    console.log(arrayNamesFinal.join(" "));

    return arrayNamesFinal.join(" ");

}

//Utils Double
const transformationDouble = (double) => {

    if(isNaN(Number(double))){

        console.log(`${double} não é um número`);
        return `${double} não é um número`;
    }

    if(Number.isInteger(double)){
        console.log(`${double} é um inteiro`);
        return `${double} é um inteiro`;
    }

    console.log(double.toString().replace(".", ","));

    return double.toString().replace(".", ",");

}


// transformationDouble(10.3);

//Utils CNPJ
const validationCNPJ = async (cnpj) => {
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
function validaCpf(cpf) {
    if (!isCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');
    var cpfBase = cpfLimpo.slice(0,9);

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

function isCpf(cpf) {
    if (!cpf) return false;

    const regexCpf = /^(\d{11}|\d{3}\.\d{3}\.\d{3}\-\d{2})$/;
    return regexCpf.test(cpf);
}

function formatarCpf(cpf) {
    if (!validaCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');

    if (cpf !== cpfLimpo) return cpfLimpo;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

//Utils telefone 
function formatarTelefone(telefone) {
    if (!isTelefone(telefone)) return false;

    var telefoneLimpo = telefone.replace(/[^\d]+/g, '');

    if (telefone !== telefoneLimpo) return telefoneLimpo;

    switch (telefoneLimpo.length) {
        case 13:
            return telefoneLimpo.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        case 11:
            return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3');
        case 9:
            return telefoneLimpo.replace(/(\d{5})(\d{4})/, '+55 (11) $1-$2');
    }
}

function isTelefone(telefone) {
    if (!telefone) return false;

    const regexTelefone = /^([+]?\d{2}?\s)?(\(?\d{2}\)?\s)?(\d{5,9})([-\s])?(\d{4})$/;
    return regexTelefone.test(telefone);
}

//Utils formatar data de nascimento
function formatarDataNascimentoSimples(data) {
    // Remove qualquer caractere não numérico
    const dataLimpa = data.replace(/\D/g, '');
    // Verifica se tem 8 dígitos
    if (dataLimpa.length !== 8) return "Formato inválido";
    // Formata para dd/MM/yyyy
    return `${dataLimpa.slice(0,2)}/${dataLimpa.slice(2,4)}/${dataLimpa.slice(4)}`;
}