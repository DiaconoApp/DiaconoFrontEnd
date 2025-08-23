const validationCEP = async (cep) => {

    try {

        cep = cep.trim().replace(/\D/g, '');

        if (!(/^\d{8}$/).test(cep)) throw {cep_error: 'CEP Inválido'};
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        const data = await response.json();

        if(data.erro){

            throw {cep_error: 'CEP não encontrado'};

        }

        return data;

    }catch(e){
        console.log(e.cep_error || e);
        return null;
    }



}

validationCEP('0000000').then(console.log);