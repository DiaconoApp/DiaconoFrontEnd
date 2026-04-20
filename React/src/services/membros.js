import api from "../provider/api";

export const buscarMembros = async ({ pagina = 0, tamanho = 10, busca = "", status = "", fkMinisterio = "" }) => {
    try {
        let url = `/api/v1/membros?page=${pagina}&size=${tamanho}&sort=nome,asc`;

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
        const ministeriosPayload = (dados.ministerios || [])
            .filter((m) => m.idExternoMinisterio)
            .map((m) => (
                m.idExternoMinisterio
            ));

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
            cargo: dados.cargo || ministeriosPayload[0]?.cargo || "MEMBRO",
            generoMembro: dados.generoMembro,
            idExternoMinisterios: ministeriosPayload,
            enderecoMembroDTO: {
                cep: dados.cep,
                bairro: dados.bairro,
                cidade: dados.cidade,
                rua: dados.rua,
                estado: dados.estado,
                numero: dados.numero,
                complemento: dados.complemento,
            },
        };

        // Primeiro, cadastrar o membro
        const res = await api.post("/api/v1/membros", payload);
        const membroCadastrado = res.data;

        return membroCadastrado;
    } catch (err) {
        console.error("Erro ao cadastrar membro:", err);
        throw err;
    }
};

export const buscarMembroPorId = async (idExterno) => {
    try {
        const res = await api.get(`/api/v1/membros/${idExterno}`);
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar membro:", err);
        throw err;
    }
};

export const atualizarMembro = async (idExterno, dadosAlterados) => {
    try {
        const res = await api.patch(`/api/v1/membros/${idExterno}`, dadosAlterados);
        return res.data;
    } catch (err) {
        console.error("Erro ao atualizar membro:", err);
        throw err;
    }
};