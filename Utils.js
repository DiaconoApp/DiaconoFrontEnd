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


transformationDouble('1.092');