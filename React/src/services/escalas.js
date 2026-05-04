import api from "../provider/api";

export const buscarEscalas = async ({ mes, ano, idMinisterio }) => {
    try {
        const cargo = localStorage.getItem("cargo");
        let url = "";

        if (idMinisterio) {
            url = `/api/v1/eventos-ministerios/evento-ministerio/${idMinisterio}?mes=${mes}&ano=${ano}`;
        } else {
            // Busca todas as escalas
            url = `/api/v1/eventos?mes=${mes}&ano=${ano}`;
        }

        const res = await api.get(url);
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar escalas:", err);
        return { content: [] };
    }
};

export const buscarEscalasGoverno = async ({ mes, ano, status = "", ministerioId = "", nomeEvento = "" }) => {
    try {
        let url = `/api/v1/escalas-evento/governo?mes=${mes}&ano=${ano}`;

        if (status && status !== "__all__") {
            url += `&status=${status}`;
        }

        if (ministerioId) {
            url += `&ministerioId=${ministerioId}`;
        }

        if (nomeEvento && nomeEvento.trim()) {
            url += `&nomeEvento=${encodeURIComponent(nomeEvento.trim())}`;
        }

        const res = await api.get(url);
        return res.data || [];
    } catch (err) {
        console.error("Erro ao buscar escalas (visão governo):", err);
        return [];
    }
};

export const buscarEscalasLider = async ({ mes, ano, status = "", ministerioId = "", nomeEvento = "" }) => {
    try {
        let url = `/api/v1/escalas-ministerio/lider-ministerio?mes=${mes}&ano=${ano}`;

        if (status && status !== "__all__") {
            url += `&status=${status}`;
        }

        if (ministerioId) {
            url += `&ministerioId=${ministerioId}`;
        }

        if (nomeEvento && nomeEvento.trim()) {
            url += `&nomeEvento=${encodeURIComponent(nomeEvento.trim())}`;
        }

        const res = await api.get(url);
        return res.data || [];
    } catch (err) {
        console.error("Erro ao buscar escalas (visão líder):", err);
        return [];
    }
};

export const buscarEscalasMembro = async ({ mes, ano, status = "", ministerioId = "", nomeEvento = "" }) => {
    try {
        let url = `/api/v1/escalas-ministerio/membro?mes=${mes}&ano=${ano}`;

        if (status && status !== "__all__") {
            url += `&status=${status}`;
        }

        if (ministerioId) {
            url += `&ministerioId=${ministerioId}`;
        }

        if (nomeEvento && nomeEvento.trim()) {
            url += `&nomeEvento=${encodeURIComponent(nomeEvento.trim())}`;
        }

        const res = await api.get(url);
        return res.data || [];
    } catch (err) {
        console.error("Erro ao buscar escalas (visão membro):", err);
        return [];
    }
};

export const buscarMembrosEscalaLider = async (idExternoEscalaEvento) => {
    try {
        if (!idExternoEscalaEvento) {
            console.log("idExternoEscalaEvento não definido");
            return [];
        }

        const url = `/api/v1/escalas-ministerio/lider-ministerio/${idExternoEscalaEvento}`;
        const res = await api.get(url);
        return res.data || [];
    } catch (err) {
        console.error(`Erro ao buscar membros da escala ${idExternoEscalaEvento}:`, err);
        return [];
    }
};

export const buscarMinisteriosEvento = async (eventoId) => {
    console.log("buscarMinisteriosEvento chamado com eventoId:", eventoId);
    if (!eventoId) {
        console.log("eventoId é undefined ou vazio, retornando []");
        return [];
    }
    try {
        console.log("Fazendo requisição para:", `/api/v1/escalas-evento/governo/${eventoId}`);
        const res = await api.get(`/api/v1/escalas-evento/governo/${eventoId}`);
        console.log("Resposta da API:", res.data);
        return Array.isArray(res.data)
            ? res.data
            : res.data?.content || res.data || [];
    } catch (err) {
        console.error(`Erro ao buscar ministérios do evento ${eventoId}:`, err);
        return [];
    }
};

export const atualizarMinisteriosEvento = async (eventoId, ministerios) => {
    try {
        const res = await api.patch(`/api/v1/escalas-evento/governo/${eventoId}`, ministerios);
        return res.data;
    } catch (err) {
        console.error(`Erro ao atualizar ministérios do evento ${eventoId}:`, err);
        throw err;
    }
};

export const atualizarEscalaMembroLider = async (idExternoEscalaEvento, membrosSelecionados) => {
    try {
        if (!idExternoEscalaEvento) {
            throw new Error("idExternoEscalaEvento não definido");
        }

        // Construir payload com apenas os membros selecionados
        // membrosSelecionados é um objeto: { [membroMinisterioId]: boolean }
        const membrosPayload = Object.entries(membrosSelecionados)
            .filter(([_, selecionado]) => selecionado)
            .map(([membroId]) => ({
                idExternoMembroMinisterio: membroId,
                status: "CONFIRMADO"
            }));

        const url = `/api/v1/escalas-ministerio/lider-ministerio/${idExternoEscalaEvento}`;
        const res = await api.patch(url, membrosPayload);
        return res.data;
    } catch (err) {
        console.error(`Erro ao atualizar escala ${idExternoEscalaEvento}:`, err);
        throw err;
    }
};

export const gerarEscalaAleatoriaLider = async (idExternoEscalaEvento, tamanhoEquipe) => {
    try {
        if (!idExternoEscalaEvento) {
            throw new Error("idExternoEscalaEvento não definido");
        }

        if (!tamanhoEquipe || Number(tamanhoEquipe) < 1) {
            throw new Error("Tamanho da equipe inválido");
        }

        const url = `/api/v1/escalas-ministerio/lider-ministerio/${idExternoEscalaEvento}/${Number(tamanhoEquipe)}`;
        const res = await api.get(url);

        if (Array.isArray(res.data)) {
            return res.data;
        }

        if (res.data?.status === "BAD_REQUEST" && res.data?.message) {
            const error = new Error(res.data.message);
            error.apiMessage = res.data.message;
            throw error;
        }

        return [];
    } catch (err) {
        console.error(`Erro ao gerar escala aleatória ${idExternoEscalaEvento}:`, err);
        throw err;
    }
};

export const revisarRandomizacaoMembroLider = async (idExternoEscalaEvento, idExternoMembroMinisterio, membrosEscalaPayload = []) => {
    try {
        if (!idExternoEscalaEvento) {
            throw new Error("idExternoEscalaEvento não definido");
        }

        if (!idExternoMembroMinisterio) {
            throw new Error("idExternoMembroMinisterio não definido");
        }

        const url = `/api/v1/escalas-ministerio/lider-ministerio/${idExternoEscalaEvento}/revisar-randomizacao/${idExternoMembroMinisterio}`;
        const res = await api.post(url, membrosEscalaPayload);
        return res.data || null;
    } catch (err) {
        console.error(`Erro ao revisar randomização para membro ${idExternoMembroMinisterio}:`, err);
        throw err;
    }
};
