import api from "../provider/api";

export const buscarPerfilLogado = async () => {
    try {
        const res = await api.get("/perfil");
        return res.data;
    } catch (err) {
        const idUsuario = localStorage.getItem("idUsuario");
        if (idUsuario) {
            try {
                const res = await api.get(`/perfil/${idUsuario}`);
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

export const atualizarPerfilLogado = async (dadosAlterados) => {
    try {
        const res = await api.patch("/perfil", dadosAlterados);
        return res.data;
    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        throw err;
    }
};

export const buscarEnderecoPorCep = async (cep) => {
    try {
        const cepLimpo = (cep || "").trim().replace(/\D/g, "");

        if (!/^\d{8}$/.test(cepLimpo)) {
            return null;
        }

        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data?.erro) {
            return null;
        }

        return data;
    } catch (err) {
        console.error("Erro ao buscar endereço por CEP:", err);
        return null;
    }
};
