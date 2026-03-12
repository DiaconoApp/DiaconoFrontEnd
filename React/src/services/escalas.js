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
