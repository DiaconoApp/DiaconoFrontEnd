const ambiente = "desenvolvimento";
//const ambiente = "produção";

let url;
let membros = [];

switch (ambiente) {
    case "desenvolvimento":
        url = "http://localhost:3000/membros";
        break;
    case "produção":
        // url = 
        break;
    default:
        throw new Error("Ambiente da aplicação não definido");
}


async function pegarMembros() {
    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        membros = dados;

        return membros;
    } catch (erro) {
        console.warn(erro);
    }
}

async function pegarMembro(idMembro) {
    const id = Number(idMembro);

    try {
        const resposta = await fetch(`${url}/${id}`);
        const dados = await resposta.json();

        membro = dados;

        return membro;
    } catch (erro) {
        console.warn(erro);
    }
}

async function adicionarMembro(
        idMembro, 
        nomeMembro,
        dataNascimentoMembro,
        cpfMembro,
        cepMembro,
        numeroCasaMembro,
        numeroCelularMembro,
        emailMembro,
        senhaMembro
    ) {
    const id = Number(idMembro);
    const nome = nomeMembro;
    const dataNascimento = dataNascimentoMembro;
    const cpf = cpfMembro;
    const cep = cepMembro;
    const numeroCasa = Number(numeroCasaMembro);
    const numeroCelular = numeroCelularMembro;
    const email = emailMembro;
    const senha = senhaMembro;

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                nome,
                dataNascimento,
                cpf,
                cep,
                numeroCasa,
                numeroCelular,
                email,
                senha
            })
        });
    } catch(erro) {
        console.warn(erro);
    }

    pegarMembros();
}

async function alterarMembro(
    idMembro, 
    nomeMembro,
    dataNascimentoMembro,
    cpfMembro,
    cepMembro,
    numeroCasaMembro,
    numeroCelularMembro,
    emailMembro,
    senhaMembro

    ) {
    const id = Number(idMembro);
    const nome = nomeMembro;
    const dataNascimento = dataNascimentoMembro;
    const cpf = cpfMembro;
    const cep = cepMembro;
    const numeroCasa = Number(numeroCasaMembro);
    const numeroCelular = numeroCelularMembro;
    const email = emailMembro;
    const senha = senhaMembro;

    try {
        const resposta = await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id,
                nome,
                dataNascimento,
                cpf,
                cep,
                numeroCasa,
                numeroCelular,
                email,
                senha
            })
        })

    } catch (erro) {
        console.warn(erro);
    }

    pegarMembros();
}

async function alterarNomeMembro(idMembro, nomeMembro) {
    const id = Number(idMembro);
    const nome = nomeMembro;

    try {
        const resposta = await fetch(`${url}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                nome
            })
        })

    } catch (erro) {
        console.warn(erro);
    }

    pegarMembros();
}

async function removerMembro(idMembro) {
    const id = Number(idMembro);

    try {
        const resposta = await fetch(`${url}/${id}`, {method:"DELETE"})
    } catch (erro) {
        console.warn(erro);
    }

    pegarMembros();
}

//adicionarMembro(
//    16,
//    "Tiago Moreira",
//    "23101994",
//    "13579246801",
//    "04012030",
//    78,
//    "11993332211",
//    "thiago.moreira@gmail.com",
//    "Th!ago94"
//);

//mostrarMembro(16);

//alterarNomeMembro(
//    16,
//    "Thiago Moreira"
//)

//alterarMembro(
//    16,
//    "Tiago Moreira da Silva",
//    "23101995",
//    "13579246801",
//    "04012030",
//    80,
//    "11993332211",
//    "thiago.moreira@gmail.com",
//    "Th!ago94"
//)

//removerMembro(16);