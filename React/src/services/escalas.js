import api from "../provider/api";

export const buscarEscalas = async ({ mes, ano, idMinisterio }) => {
    try {
        const cargo = localStorage.getItem("cargo");

        let url = `/api/v1/eventos-ministerios/evento-ministerio/${idMinisterio}?mes=${5}&ano=${2024}`

        // switch (cargo) {
        //     case "GOVERNO":
        //         url = `/api/v1/eventos/evento-ministerio?mes=${mes}&ano=${ano}`
        //         break;
        //     case "LIDER_MINISTERIO":
        //         url = `/api/v1/eventos-ministerios/evento-ministerio/${idMinisterio}?mes=${mes}&ano=${ano}`
        //         break;
        //     case "MEMBRO":
        //         url = `/api/v1/escala/membro?mes=${5}&ano=${2024}`
        //         break;
        // }
        const res = await api.get(url);
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar escalas:", err);
    }
};
