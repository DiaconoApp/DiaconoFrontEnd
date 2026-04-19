import api from "../provider/api";

export const buscarTodosMinisterios = async () => {
  try {
    const res = await api.get("/api/v1/ministerios");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar ministérios:", err);
    return { content: [], totalPages: 1 };
  }
};

export const buscarMinisterios = async (params = {}) => {
  const { pagina = 0, tamanho = 10, busca = "", status = "" } = params;
  try {
    let url = `/api/v1/ministerios/governo?page=${pagina}&size=${tamanho}`;

    if (busca.trim()) {
      url += `&buscaGeral=${encodeURIComponent(busca.trim())}`;
    }

    if (status.trim().toLowerCase() !== "todos") {
      url += `&status=${status.trim().toUpperCase()}`;
    }

    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar ministérios:", err);
    return { content: [], totalPages: 1 };
  }
};

export const buscarMembrosMinisterios = async (params = {}) => {
  const {
    pagina = 0,
    tamanho = 10,
    busca = "",
    status = "",
    idMinisterio,
    sort = [],
    buscaGeral = "",
  } = params;
  try {
    let url = `/api/v1/ministerios/lider-ministerio/${idMinisterio}?page=${pagina}&size=${tamanho}`;

    if (busca.trim()) {
      url += `&buscaGeral=${encodeURIComponent(busca.trim())}`;
    }

    if (status.trim().toLowerCase() !== "todos") {
      url += `&status=${status.trim().toUpperCase()}`;
    }

    if (Array.isArray(sort) && sort.length > 0) {
      url += `&sort=${encodeURIComponent(JSON.stringify(sort))}`;
    }

    if (buscaGeral.trim()) {
      url += `&buscaGeral=${encodeURIComponent(buscaGeral.trim())}`;
    }

    const res = await api.get(url);
    return res.data || [];
  } catch (err) {
    console.error("Erro ao buscar membros do ministério:", err);
    return { content: [], totalPages: 1 };
  }
};

export const buscarMinisteriosQueLidero = async () => {
  try {
    const res = await api.get("/api/v1/ministerios/lider-ministerio");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar ministérios:", err);
  }
};

export const removerMembroMinisterio = async ({idMinisterio, idMembro}) => {
  try {
    const res = await api.delete(`/api/v1/ministerios/lider-ministerio/${idMinisterio}/${idMembro}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao remover membro do ministério:", err);
  }
};

export const cadastrarMinisterio = async (dados) => {
  try {
    const payload = {
      idLider: dados.idLider,
      nome: dados.nome,
    };

    const res = await api.post("/api/v1/ministerios/governo", payload);
    return res.data;
  } catch (err) {
    console.error("Erro ao cadastrar ministério:", err);
    throw err;
  }
};

export const atualizarMinisterio = async ({ dados, idMinisterio }) => {
  try {
    if (!idMinisterio) throw new Error("ID do ministério não informado.");

    const payload = {
      idLider: dados.idLider,
      nome: dados.nome,
      status: dados.status?.toUpperCase(),
    };

    const res = await api.patch(`/api/v1/ministerios/governo/${idMinisterio}`, payload);
    return res.data;
  } catch (err) {
    console.error(`Erro ao atualizar ministério ${idMinisterio}:`, err.response?.data || err.message);
    throw err;
  }
};

export const adicionarMembroMinisterio = async ({ dados, idMinisterio }) => {
  try {
    if (!idMinisterio) throw new Error("ID do ministério não informado.");

    const payload = {
      idExterno: dados.idMembro
    };

    const res = await api.patch(`/api/v1/ministerios/lider-ministerio/${idMinisterio}`, payload);
    return res.data;
  } catch (err) {
    console.error(`Erro ao adicionar membro ao ministério ${idMinisterio}:`, err.response?.data || err.message);
    throw err;
  }
};