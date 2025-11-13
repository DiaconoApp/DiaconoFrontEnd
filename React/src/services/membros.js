import api from "../provider/api";

export const buscarMembros = async ({ pagina = 0, tamanho = 10, busca = "", status = "", fkMinisterio = "" }) => {
    try {
        let url = `/membros?page=${pagina}&size=${tamanho}`;

        if (busca.trim()) {
            url += `&buscaGeral=${encodeURIComponent(busca.trim())}`;
        }

        if (status.trim().toLowerCase() !== "todos") {
            url += `&status=${status.trim().toUpperCase()}`;
        }

        if (fkMinisterio.trim()) {
            url += `&fkMinisterio=${encodeURIComponent(fkMinisterio.trim())}`;
        }

        const res = await api.get(url);
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar membros:", err);
        return { content: [], totalPages: 1 };
    }
};

export const cadastrarMembro = async (dados) => {
    try {
        const payload = {
            fkIgreja: dados.fkIgreja,
            nome: dados.nome,
            cpf: dados.cpf,
            dataNascimento: typeof dados.dataNascimento === "string"
                ? dados.dataNascimento
                : dados.dataNascimento.toISOString().slice(0, 10),
            email: dados.email.trim(),
            celular: dados.celular,
            senha: dados.senha,
            idExternoMinisterios: dados.idExternoMinisterios || [],
            cargo: dados.cargo || "",
            membroEnderecoDTO: {
                cep: dados.cep,
                bairro: dados.bairro,
                cidade: dados.cidade,
                rua: dados.rua,
                estado: dados.estado,
                numero: dados.numero,
                complemento: dados.complemento || "",
            },
        };

        const res = await api.post("/membros", payload);
        return res.data;
    } catch (err) {
        console.error("Erro ao cadastrar membro:", err);
        throw err;
    }
};