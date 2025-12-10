import api from "../provider/api";

// =============================
//  MINISTÉRIOS
// =============================

// Quantidade de membros por ministério
export async function getQtdMembrosMinisterios(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/ministerios/quantidade-membros", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar quantidade de membros por ministério:", error);
    throw error;
  }
}

// Quantidade de eventos por ministério
export async function getQtdEventosMinisterios(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/ministerios/quantidade-eventos", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar quantidade de eventos por ministério:", error);
    throw error;
  }
}

// KPIs dos ministérios
export async function getKpisMinisterios(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/ministerios/kpis", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar KPIs dos ministérios:", error);
    throw error;
  }
}

// Evolução por ministério (RECEBE ID)
export async function getEvolucaoMinisterio(idMinisterio, anoInicio, anoFim) {
  try {
    const res = await api.get(`/api/v1/dashboards/ministerios/evolucao/${idMinisterio}`, {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar evolução do ministério:", error);
    throw error;
  }
}

// =============================
//  MEMBROS
// =============================

// KPIs dos membros
export async function getKpisMembros(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/membros/kpis", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar KPIs de membros:", error);
    throw error;
  }
}

// Distribuição por gênero
export async function getGeneroMembros(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/membros/genero", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar gênero dos membros:", error);
    throw error;
  }
}

// Distribuição por faixa etária
export async function getFaixaEtariaMembros(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/membros/faixa-etaria", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar faixa etária dos membros:", error);
    throw error;
  }
}

// Evolução dos membros no período
export async function getEvolucaoMembros(anoInicio, anoFim) {
  try {
    const res = await api.get("/api/v1/dashboards/membros/evolucao", {
      params: { anoInicio, anoFim }
    });
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar evolução dos membros:", error);
    throw error;
  }
}
