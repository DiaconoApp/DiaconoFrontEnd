import api from "../provider/api";

export const buscarMinisterios = async () => {
  try {
    const res = await api.get("api/v1/ministerios");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar ministérios:", err);
    return [];
  }
};