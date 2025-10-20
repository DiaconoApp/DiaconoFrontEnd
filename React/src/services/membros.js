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