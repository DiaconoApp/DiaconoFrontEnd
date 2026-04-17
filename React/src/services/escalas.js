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
