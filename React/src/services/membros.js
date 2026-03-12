import api from "../provider/api";

export const buscarMembros = async ({ pagina = 0, tamanho = 10, busca = "", status = "", fkMinisterio = "" }) => {
    try {
        let url = `/membros?page=${pagina}&size=${tamanho}&sort=nome,asc`;

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
            idExternoMinisterios: dados.idExternoMinisterios,
            cargo: dados.cargo,
            generoMembro: dados.generoMembro,
            membroEnderecoDTO: {
                cep: dados.cep,
                bairro: dados.bairro,
                cidade: dados.cidade,
                rua: dados.rua,
                estado: dados.estado,
                numero: dados.numero,
                complemento: dados.complemento,
            },
        };

        const res = await api.post("/membros", payload);
        return res.data;
    } catch (err) {
        console.error("Erro ao cadastrar membro:", err);
        throw err;
    }
};

export const buscarMembroPorId = async (idExterno) => {
    try {
        const res = await api.get(`/membros/${idExterno}`);
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar membro:", err);
        throw err;
    }
};

export const buscarPerfilLogado = async () => {
    try {
        // Tenta o endpoint /me primeiro
        const res = await api.get('/membros/me');
        return res.data;
    } catch (err) {
        // Fallback: tenta buscar pelo idUsuario do localStorage
        const idUsuario = localStorage.getItem("idUsuario");
        if (idUsuario) {
            try {
                const res = await api.get(`/membros/${idUsuario}`);
                return res.data;
            } catch (fallbackErr) {
                console.error("Erro ao buscar perfil (fallback):", fallbackErr);
                throw fallbackErr;
            }
        }
        console.error("Erro ao buscar perfil:", err);
        throw err;
    }
};

export const atualizarMembro = async (idExterno, dados) => {
    try {
        const payload = {
            nome: dados.nome,
            cpf: dados.cpf,
            dataNascimento: typeof dados.dataNascimento === "string"
                ? dados.dataNascimento
                : dados.dataNascimento.toISOString().slice(0, 10),
            email: dados.email?.trim(),
            celular: dados.celular,
            cargo: dados.cargo,
            funcaoMembro: dados.funcaoMembro,
            generoMembro: dados.generoMembro,
            confirmacaoFe: dados.confirmacaoFe,
            membroEnderecoDTO: {
                cep: dados.cep,
                bairro: dados.bairro,
                cidade: dados.cidade,
                rua: dados.rua,
                estado: dados.estado,
                numero: dados.numero,
                complemento: dados.complemento,
            },
        };

        const res = await api.put(`/membros/${idExterno}`, payload);
        return res.data;
    } catch (err) {
        console.error("Erro ao atualizar membro:", err);
        throw err;
    }
};